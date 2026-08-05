Not used yet. This project currently manages state with React Context
(`../context/AuthContext.jsx`) and local component state / custom hooks
(`../features/*/hooks`), which is enough for its current size.

If the app grows enough to need shared global state across many unrelated
features, add Redux Toolkit here: `redux/store.js` plus one slice per
feature (e.g. `redux/slices/schoolsSlice.js`).
