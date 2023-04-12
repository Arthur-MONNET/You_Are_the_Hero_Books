const fs = require('fs');

class File {
    constructor(path) {
        this.path = path;
        this.create();
    }
    create() {
        fs.writeFile(this.path, '', (err) => {
            if (err) {
                throw err;
            }
        });
    }
    add(text) {
        return new Promise((resolve, reject) => {
            fs.appendFile(this.path, text, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    async addTitle(title, level = 1) {
        return new Promise((resolve, reject) => {
            try {
                this.add("\n" + "#".repeat(level) + " " + title + "\n");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async addImage(name) {
        const picture = name + ".png";
        if (fs.existsSync("assets/" + picture)) {
            return new Promise((resolve, reject) => {
                try {
                    this.add("![image](assets/" + picture + ")\n");
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }

    async addPage(name, page) {
        return new Promise((resolve, reject) => {
            try {
                this.addTitle(name, 2)
                    .then(() => {
                        return this.addImage(name);
                    })
                    .then(() => {
                        this.add(page.text + "\n");
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = File;