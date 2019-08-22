function increaseNumberNotification (className, number) {
    let currentValue = +$(`.${className}`).text();
    currentValue += number;
  
    if(currentValue === 0) {
      $(`.${className}`).css("display", "none").html("");
    }else {
      $(`.${className}`).css("display", "block").html(currentValue);
    }
}

function decreseNumberNotification (className,number) {
    let currentValue = +$(`.${className}`).text();
    currentValue -= number;
  
    if(currentValue === 0) {
        $(`.${className}`).css("display", "none").html("");
    }else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
}
  