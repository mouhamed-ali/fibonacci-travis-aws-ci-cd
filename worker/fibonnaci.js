// we will calculate the fibonnaci sequence in this script using the recursive solution

const fib = index => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

module.exports = fib;
