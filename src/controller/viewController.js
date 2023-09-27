// viewController.js
export const homeViewController = (request, response) => {
  response.render("home");
};

export const introduceViewController = (request, response) => {
  response.render("introduce");
};

export const courseViewController = (request, response) => {
  response.render("course");
};

export const qrViewController = (request, response) => {
  response.render("qr");
};

export const profileViewController = (request, response) => {
  response.render("profile");
};

export const joinViewController = (request, response) => {
  response.render("join");
};

export const loginViewController = (request, response) => {
  response.render("login");
};
