//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const FormattingType = require('../Enums/FormattingType')
// ────────────────────────────────────────────────────────────────────────────────


class StringFormatter {
    constructor(stringToBeFormatted, formattingType) {
        switch (formattingType) {
            case FormattingType.GSM:
                let tempString = stringToBeFormatted.trim().replace(/ /g, '').replace('(', '').replace(')', '');
                this.formattedString = tempString.substring(tempString.length - 10, tempString.length);
        }
    }
}

module.exports = StringFormatter;