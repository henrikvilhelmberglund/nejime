export function tooltip(element: any, text: string) {
	let div: HTMLDivElement;

	let offsetY = 50;
	let offsetX = 50;
	function mouseOver(event: MouseEvent) {
		div = document.createElement("div");
		div.textContent = text;
		div.classList.add("my-tooltip");
		div.style.position = "absolute";
		div.style.textAlign = "center";
		div.style.top = `${event.pageY + offsetY} px`;
		div.style.left = `${event.pageX + offsetX} px;`;
		if (localStorage.theme === "dark" || !("theme" in localStorage)) {
			div.style.color = "#fff";
		} else {
			div.style.color = "#000";
		}
		document.body.appendChild(div);
	}
	function mouseMove(e: MouseEvent) {
		div.style.left = `${e.pageX - offsetX}px`;
		div.style.top = `${e.pageY - offsetY}px`;
	}
	function mouseLeave() {
		document.body.removeChild(div);
	}

	element.addEventListener("mouseover", mouseOver);
	element.addEventListener("mouseleave", mouseLeave);
	element.addEventListener("mousemove", mouseMove);

	return {
		destroy() {
			element.removeEventListener("mouseover", mouseOver);
			element.removeEventListener("mouseleave", mouseLeave);
			element.removeEventListener("mousemove", mouseMove);
		}
	};
}
