// const signIn = document.getElementById("signIn");
// const signUp = document.getElementById("signUp");
// const search = document.getElementById("search");
// const logOut = document.getElementById("logOut");

// signIn.addEventListener("click", function (e) {
//   window.location.href = "/login";
// });

// signUp.addEventListener("click", function (e) {
//   window.location.href = "/register";
// });

// logOut.addEventListener("click", function (e) {
//   console.log(`Logged out hitting ${window.location.href}`);
//   window.location.href = "/logout";
// });

document.addEventListener("DOMContentLoaded", (event) => {
  const previousBtn = document.getElementById("previous");
  const nextBtn = document.getElementById("next");
  const pageNumber = document.getElementById("pageNumber");
  let currentPage = parseInt(pageNumber.getAttribute("currentPage"));

  previousBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      window.location.href = `/issue-tracker/?page=${currentPage}`;
    }
  });

  nextBtn.addEventListener("click", (event) => {
    event.preventDefault();
    currentPage++;
    window.location.href = `/issue-tracker/?page=${currentPage}`;
  });
});
