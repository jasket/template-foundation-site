import Alert from "./module/alert-modal";

$(function() {
	Alert.open({
		title: "Приветствие",
		text: "Пример модального окна предупреждения"
	});
});