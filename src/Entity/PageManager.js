const out = require('../utils/output.js');
const input = require('../utils/input.js');

class PageManager {
    constructor(book, recap, player, eventManager) {
        this.book = book;
        this.recap = recap;
        this.player = player;
        this.eventManager = eventManager;
        this.eventManager.setPageManager(this);
    }
    start(page) {
        input.getSpecificKey("", "\nPressez ENTREE pour lancer le jeu !").then(res => {
            this.goTo(page);
        });
    }
    async goTo(page) {
        if(this.testPage(page)) {
            this.drawPage();
            await this.writePage();
            this.runEvent(this.book[this.currentPage].events[0]);
        } else if (this.testEvent(page)) {
            this.runEvent(this.book[this.currentPage].events[this.currentEvent]);
        } else {
            out.pageError(page);
            return false;
        }


    }
    testPage(page) {
        if(this.book[page]) {
            this.changePage(page);
            return true;
        } else {
            return false;
        }
    }
    testEvent(page) {
        if(page.includes('.events[') && this.book[page.substring(0, page.indexOf('.'))]) {
            this.currentPage = page.substring(0, page.indexOf('.'));
            this.currentEvent = page.substring(page.indexOf('[') + 1, page.indexOf(']'));
            return true;
        } else {
            return false;
        }
    }

    changePage(page) {
        if(this.currentPage === page) return;
        this.currentPage = page;
        this.player.decrementUseGun();
    }

    drawPage() {
        out.drawParagraph(this.book[this.currentPage]);
    }
    async writePage() {
        await this.recap.addPage(this.currentPage, this.book[this.currentPage]);
    }

    runEvent(event) {
        this.eventManager.run(event);
    }
}

module.exports = PageManager;