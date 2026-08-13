import { programSubmissionsRepository } from '../repositories/programSubmissions.repository.js';
import { validateProgramSubmission } from '../validators/programSubmission.validator.js';
import { sendToBothTopics } from './telegram.service.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Builds the message text sent to Telegram, mirroring a typical program-announcement template. */
function buildMessage(sub) {
  const students = (sub.students_involved || []).filter(Boolean);
  const lines = [
    `<b>📋 PROGRAM SEKOLAH</b>`,
    ``,
    `<b>Nama Sekolah:</b> ${sub.school_name}`,
    `<b>Tarikh Program:</b> ${formatDate(sub.program_date)}`,
    `<b>Jenis Program:</b> ${sub.program_type}`,
    `<b>Masa:</b> ${sub.start_time} – ${sub.end_time}`,
    `<b>Guru Bertugas:</b> ${sub.teacher_on_duty}`,
    students.length ? `<b>Pelajar Terlibat:</b> ${students.join(', ')}` : null,
    `<b>Jumlah Manpower:</b> ${sub.total_manpower}`,
    sub.needs_additional_manpower
      ? `<b>Manpower Tambahan Diperlukan:</b> Ya (${sub.additional_manpower_count})`
      : `<b>Manpower Tambahan Diperlukan:</b> Tidak`,
    sub.sheet_program_url ? `<b>Sheet Program:</b> ${sub.sheet_program_url}` : null,
    ``,
    `<b>PIC Program</b>`,
    `Main PIC: ${sub.main_pic_telegram}`,
    `PIC Legality: ${sub.legality_pic_telegram}`,
    `PIC Virality: ${sub.virality_pic_telegram}`,
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export const programSubmissionsService = {
  async submit(payload) {
    validateProgramSubmission(payload);

    const submission = await programSubmissionsRepository.create({
      virality_ack_before_1: payload.virality_ack_before_1,
      virality_ack_before_2: payload.virality_ack_before_2,
      virality_ack_after_1: payload.virality_ack_after_1,
      school_name: payload.school_name,
      program_date: payload.program_date,
      program_type: payload.program_type,
      start_time: payload.start_time,
      end_time: payload.end_time,
      teacher_on_duty: payload.teacher_on_duty,
      students_involved: payload.students_involved || [],
      total_manpower: payload.total_manpower,
      needs_additional_manpower: !!payload.needs_additional_manpower,
      additional_manpower_count: payload.additional_manpower_count || 0,
      sheet_program_url: payload.sheet_program_url || '',
      main_pic_telegram: payload.main_pic_telegram,
      legality_pic_telegram: payload.legality_pic_telegram,
      virality_pic_telegram: payload.virality_pic_telegram,
    });

    // Telegram delivery is best-effort — a submission is still saved even if this fails,
    // since the topic IDs aren't configured yet. The result is recorded either way.
    const message = buildMessage(submission);
    const { sent, error } = await sendToBothTopics(message).catch((err) => ({ sent: false, error: err.message }));

    const updated = await programSubmissionsRepository.markTelegramResult(submission.id, { sent, error });
    return updated;
  },
};
