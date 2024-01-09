export function use(variable) {
  return new Promise((resolve) => {
    if (variable) {
      resolve(variable);
    } else {
      const checkVariable = () => {
        if (variable) {
          resolve(variable);
        } else {
          setTimeout(checkVariable, 100); // Check again after 100 milliseconds
        }
      };
      checkVariable();
    }
  });
}

export function processNextTick(callback) {
  setTimeout(callback, 0);
}