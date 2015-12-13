

module.exports = {
    waitForElement: function(selector) {
        browser.wait(function() {
            return browser.driver.isElementPresent(selector);
        }, 5000);
    }
};