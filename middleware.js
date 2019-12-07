// I'm not sure about the desired behavior in case, for example,
// if client sends 3 normal requests, then 2 bad requests (without text)
// and then one more normal request. Should the middleware count all the requsts
// including bad ones? Now my logic is like this.
// Or it should count only successfull requests? Then I need to rewrite it.

let count = 0;

module.exports = function(req, res, next) {
  if (count == 5) {
    res.status(429).send();
  } else {
    count += 1;
    next();
  }
};
