/*=================================================
  Loading Screen
=================================================*/
window.addEventListener("load", () => {
  const screen = this.document.getElementById("load");
  if (screen) {
    const loaded = () => {
      this.setTimeout(() => {
        screen.style.opacity = 0;
        const list = screen.getElementsByClassName("load__text");
        for (let i = 0, j = list.length; i < j; ++i) {
          list[i].classList.add("load__text--loaded");
        }
      }, 500);
      this.setTimeout(() => {
        screen.style.display = "none";
      }, 1000);
    }

    const tr = screen.getElementsByClassName("load__trigger")[0];
    tr.addEventListener("webkitAnimationEnd", loaded);
    tr.addEventListener("animationend", loaded);
    tr.addEventListener("oanimationend", loaded); 
    
    // move to top
    window.scrollTo(0, 0);
  }
});


/*=================================================
  After Loading
=================================================*/
window.addEventListener("DOMContentLoaded", () => {

  // Custom functions
  const toggle = (e, c) => {
    if (!e) return;
    if (e.classList.contains(c)) e.classList.remove(c);
    else e.classList.add(c);
  }

  // event listener function
  const on = (type, el, listener) => {
    if (!el) return;
    if(Array.isArray(el)) {
      el.forEach(e => e.addEventListener(type, listener));      
    } else {
      el.addEventListener(type, listener);
    }
  }


  //======== Alert message
  const alert = document.getElementById("alert");
  if (alert) {
    let closed = sessionStorage.getItem("alert_closed");
    let hidden = alert.classList.contains("hidden");
    if (!closed && !hidden) {
      const button = alert.getElementsByClassName("alert__button")[0];
      on("click", alert, () => {
        sessionStorage.setItem("alert_closed", true);
        alert.style.display = "none";
      });
    }
    else {
      alert.style.display = "none";  
    }
  }

  /*=================================================
    Topbar button toggle
  =================================================*/
  const sidemenu  = document.getElementById("sidemenu");
  const topbar = document.getElementsByClassName("topbar__button")[0];
  const brand = document.getElementsByClassName("topbar__brand")[0];
  if (topbar) {
    topbar.addEventListener("click", () => {
      toggle(brand, "active");
      toggle(topbar, "active");
      toggle(sidemenu, "active");
    });
  }

  /*=================================================
    Main screen image
  =================================================*/
  const main = document.getElementById("main");
  if (main) {
    const content = main.getElementsByClassName("main__content")[0];
    const carousel = main.getElementsByClassName("main__carousel")[0];
    const contentList = content.getElementsByClassName("main__content-item");
    const carouselList = carousel.getElementsByClassName("main__carousel-item");
    
    let timer, action;
    const auto = main.classList.contains("auto");
    const interval = main.dataset.interval != undefined ? main.dataset.interval : 3000;
    const spin = () => {
      action(carousel, carouselList);
      action(content, contentList);
      if (auto) {
        this.clearInterval(timer);
        timer = this.setInterval(() => {
          action(carousel, carouselList);
          action(content, contentList);
        }, interval);
      }
    }

    const forward = (base, list) => {
      base.classList.add("main__transition--slide");
      base.style.transform = "translateX(-100%)";
      this.setTimeout(() => {
        base.appendChild(list[0]);
        base.classList.remove("main__transition--slide");
        base.style.transform = "";
      }, 500);
    }

    const backward = (base, list) => {
      base.insertBefore(list[list.length - 1], base.firstChild);
      base.style.transform = "translateX(-100%)";
      this.setTimeout(() => {
        base.classList.add("main__transition--slide");
        base.style.transform = "";
      }, 10);
      this.setTimeout(() => {
        base.classList.remove("main__transition--slide");
      }, 490);
    }
    
    action = forward;

    const next = main.getElementsByClassName("main__control-arrow--next")[0];
    const prev = main.getElementsByClassName("main__control-arrow--prev")[0];
    on("click", next, () => { action = forward; spin(); });
    on("click", prev, () => { action = backward; spin(); });
    
    if (auto) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          if (!action) {
            action = forward;
          }
          timer = this.setInterval(() => {
            action(carousel, carouselList);
            action(content, contentList);
          }, interval);
        }
        else {
          auto && this.clearInterval(timer);
        }
      });
      observer.observe(main);
    }
  }

  // Intersection observer
  
  // mover
  const gallery = document.getElementsByClassName("gallery")[0];
  const mover = document.getElementsByClassName("gallery-mover")[0];
  const list = document.getElementsByClassName("gallery-list")[0];

  mover.style.width = list.getBoundingClientRect().width - mover.getBoundingClientRect().width + "px";

  // function
  let top = gallery.getBoundingClientRect().top;
  let bottom = gallery.getBoundingClientRect().bottom - window.innerHeight;
  console.log(top + " / " + bottom);

  const mover_func = () => {
    let scrollTop = document.documentElement.scrollTop;
    // console.log(scrollTop);
    if (scrollTop > top && scrollTop <= bottom) {
      let height = bottom - top;
      let pos = scrollTop - top;
      let percent = pos / height * 100;
      // console.log(scrollTop + " (" + percent + "%)");
      let transform = `translate3d(-${percent}%, 0px, 0px)`;
      mover.style.willChange = "transform";
      mover.style.transform = transform;
      mover.style.transformStyle = "preserve-3d";
    }
  };

  window.addEventListener("scroll", mover_func);

  // const io = new IntersectionObserver(entries => {
  //   entries.forEach(entry => {
  //     if (entry.intersectionRatio > 0) {
  //       console.log(entry.boundingClientRect);
  //       window.addEventListener("scroll", mover_func);
  //     }
  //     else {
  //       window.removeEventListener("scroll", mover_func);
  //     }
  //   })
  // });
  // io.observe(mover);

  const footer = document.getElementById("footer");
  const contact = document.getElementById("contact");
  const contact_cont = contact.getElementsByTagName("div")[0];
  const contact_scroll = () => {
    let scrollTop = document.documentElement.scrollTop;
    if (scrollTop > window.scrollY + contact.getBoundingClientRect().top) {
      console.log("aaa" + scrollTop);
      contact_cont.style.position = "static";
    }
  };

  const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      console.log(entry.boundingClientRect);
      window.addEventListener("scroll", mover_func);
    }
    else {
      window.removeEventListener("scroll", mover_func);
    }
  })
});
io.observe(mover);
  window.addEventListener("scroll", contact_scroll);

});
