import * as alt from 'alt';
import * as natives from 'natives';

class HelpTextStreamer {
	constructor() {
		this.helpText = {};
	}

	async addHelpText(entityId, text, position, entityType) {
		this.removeHelpText(+entityId);
		this.clearHelpText(+entityId);

		let HelpText = {
			onDisplay: true, position: position,
			entityId: +entityId, entityType: +entityType,
			text: text,
		};

		this.helpText[entityId] = HelpText;
		this.setText(+entityId, text);
	}

	getHelpText(entityId) {
		if (this.helpText.hasOwnProperty(entityId)) {
			return this.helpText[entityId];
		} else {
			return null;
		}
	}

	restoreHelpText(entityId) {
		if (this.helpText.hasOwnProperty(entityId)) {
			this.helpText[entityId].onDisplay = true;
		}
	}

	removeHelpText(entityId) {
		if (this.helpText.hasOwnProperty(entityId)) {
			this.helpText[entityId].onDisplay = false;
		}
	}

	clearHelpText(entityId) {
		if (this.helpText.hasOwnProperty(entityId)) {
			delete this.helpText[entityId];
		}
	}

	clearAllHelpText() {
		this.helpText = {};
	}

	setPosition(entityId, pos) {
		if (this.helpText.hasOwnProperty(entityId)) {
			this.helpText[entityId].position = pos;
		}
	}

	setText(entityId, text = "Non défini") {
		if (this.helpText.hasOwnProperty(entityId)) {
			this.helpText[entityId].text = text;
		}
	}
}

export const helpTextStreamer = new HelpTextStreamer();

alt.on("resourceStop", () => {
	helpTextStreamer.clearAllHelpText();
});

function drawHelpText(text) {
	natives.beginTextCommandDisplayHelp("STRING");
	natives.addTextComponentSubstringPlayerName(text);
	natives.endTextCommandDisplayHelp(0, false, false, 0);
}

alt.everyTick(() => {
	for (var key in helpTextStreamer.helpText) {
		let helpText = helpTextStreamer.helpText[key];
		if (helpText.onDisplay) {
			drawHelpText(helpText.text);
		}
	}
});
