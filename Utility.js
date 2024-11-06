export class Utility {
    generateUid(len) {
        let uid = "";
        for (let i = 0; i < len; i++) {
            const digit = Math.round(Math.random() * 15);
            uid += digit.toString(16);
        }
        return uid;
    }
}
//# sourceMappingURL=Utility.js.map