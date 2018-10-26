const $alert = $("[slot=alert-modal]");
const $title = $alert.find("[slot=alert-title]");
const $text = $alert.find("[slot=alert-text]");

function alertClose() {
  $alert.foundation("close");
}

function alertOpen({ title = "Внимание", text = "" }) {
  $alert.find("[slot=alert-title]").text(title);
  $alert.find("[slot=alert-text]").text(text);
  $alert.foundation("open");
}

export default {
  open: alertOpen,
  close: alertClose
};
