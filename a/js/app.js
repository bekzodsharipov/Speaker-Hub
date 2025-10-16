document.addEventListener("DOMContentLoaded", function () {
    // --- Foydalanuvchi harakatini yuborish funksiyasi ---
    function sendEvent(eventType) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://user-action-tracker.asosit.uz/events", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Yuborildi:", xhr.responseText);
          } else {
            console.error("Xatolik:", xhr.status);
          }
        }
      };
      xhr.send(JSON.stringify({ type: eventType, site_name: "Asosiy" }));
    }
  
    sendEvent("Saytga kirdi");
  
    // --- Elementlar ---
    var registerBtns = document.querySelectorAll(".registerBtn");
    var modal = document.getElementById("registrationModal");
    var closeModalBtn = document.getElementById("closeModalBtn");
    var overlay = document.querySelector(".homeModalOverlay");
    var form = document.getElementById("registrationForm");
    var phoneInput = document.getElementById("phone");
    var phoneError = document.getElementById("phoneError");
    var submitBtn = document.getElementById("submitBtn");
    var selectedCountry = document.getElementById("selectedCountry");
    var selectedCountryCode = document.getElementById("selectedCountryCode");
    var countryDropdown = document.getElementById("countryDropdown");
    var dropdownIcon = document.getElementById("dropdownIcon");
  
    var countries = [
      { name: "Uzbekistan", code: "+998" },
      { name: "AQSH", code: "+1" },
      { name: "Janubiy Koreya", code: "+82" },
      { name: "Qirg’iziston", code: "+996" },
      { name: "Qozog’iston", code: "+7" },
      { name: "Tojikiston", code: "+992" },
      { name: "Turkmaniston", code: "+993" },
      { name: "Polsha", code: "+48" }
    ];
  
    var formats = {
      "+998": {
        placeholder: "88 888 88 88",
        format: function (num) {
          var t = "";
          if (num.length > 0) t += num.slice(0, 2);
          if (num.length > 2) t += " " + num.slice(2, 5);
          if (num.length > 5) t += " " + num.slice(5, 7);
          if (num.length > 7) t += " " + num.slice(7, 9);
          return t;
        },
        validate: function (val) {
          return /^\d{2} \d{3} \d{2} \d{2}$/.test(val);
        }
      }
      // qolgan davlatlar ham shu strukturada qo‘shilishi mumkin
    };
  
    var currentCode = "+998";
  
    // --- Modalni yopish ---
    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflowY = "scroll";
    }
  
    closeModalBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
  
    // --- Ro‘yxatdan o‘tish tugmalari ---
    for (var i = 0; i < registerBtns.length; i++) {
      registerBtns[i].addEventListener("click", function () {
        sendEvent("Tugmani bosdi");
        modal.style.display = "block";
        document.body.style.overflowY = "hidden";
      });
    }
  
    // --- Forma yuborish ---
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = phoneInput.value;
      var format = formats[currentCode] || formats["+998"];
  
      if (!format.validate(val)) {
        phoneError.style.display = "block";
        return;
      }
  
      phoneError.style.display = "none";
      submitBtn.textContent = "YUBORILMOQDA...";
      submitBtn.disabled = true;
  
      var now = new Date();
      var data = {
        TelefonRaqam: currentCode + " " + val,
        SanaSoat: now.toLocaleDateString("uz-UZ") + " - " + now.toLocaleTimeString("uz-UZ")
      };
  
      localStorage.setItem("formData", JSON.stringify(data));
      window.location.href = "/thankYou.html";
    });
  
    // --- Telefon input formatlash ---
    phoneInput.addEventListener("input", function () {
      var digits = this.value.replace(/\D/g, "");
      var format = formats[currentCode] || formats["+998"];
      this.value = format.format(digits);
      phoneError.style.display = "none";
    });
  
    // --- Timer (02:00 dan orqaga sanaydi, to‘xtaganda 00:00 chiqadi) ---
    var totalSeconds = 120; // 2 daqiqa
    var timerElement = document.getElementById("timer");
  
    var countdown = setInterval(function () {
      if (totalSeconds <= 0) {
        clearInterval(countdown);
        timerElement.textContent = "00:00"; // ✅ 00:00 qilib to‘xtaydi
        return;
      }
  
      totalSeconds--;
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;
      var m = minutes.toString().padStart(2, "0");
      var s = seconds.toString().padStart(2, "0");
      timerElement.textContent = m + ":" + s;
    }, 1000);
  });