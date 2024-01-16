function Gen(str) {
    const chars = str.split('');
    
    for (let i = chars.length; i >= 1; i--) {
      const randomNumber = Math.random();

      if(chars[i] == " " || chars[i] == "-") continue;
      
      if (randomNumber < 0.7) {
        chars[i] = '#';
      }
    }
  
    const newStr = chars.join('');
  
    return newStr;
  }

  module.exports = {
    Gen
  }