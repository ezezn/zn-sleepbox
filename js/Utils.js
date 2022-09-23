export const defer = function () {
	var res, rej;

	var promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});

	promise.resolve = res;
	promise.reject = rej;

	return promise;
}

 export const kebabize = function (str) {
    return str.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter
         ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
         : letter;
      }).join('');
  }
  
  export const camelize = function (str) {
    let arr = str.split('-');
    let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase());
    // ^-- change here.
    let capitalString = capital.join("");
    return capitalString
  }