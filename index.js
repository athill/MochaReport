function MochaReport(start, end) {
    this.report = {
            stats : {
                suites: 1,
                tests: 0,
                passes: 0,
                pending: 0,
                failures: 0,
                duration: end - start,
                start: start,
                end: end
            },
            failures : [],
            passes : [],
            skipped : []
        };
}

MochaReport.prototype.addFailure = function(id, error) {
    var entry = this.getEntry(id);
    entry.error = error;
    this.add('failures', entry);
};

MochaReport.prototype.addSkipped = function(id) {
    this.add('skipped', this.getEntry(id));
};

MochaReport.prototype.addPassing = function(id) {
    this.add('passes', this.getEntry(id));
};

MochaReport.prototype.add = function(type, entry) {
    this.report[type].push(entry);
    this.report.stats.tests++;
    var statType = (type == 'skipped') ? 'pending' : type;
    this.report.stats[statType]++;
}

MochaReport.prototype.getEntry = function(title, fullTitle, duration) {
    fullTitle = fullTitle || title;
    duration = duration || 0;
    var entry = {
      title: title,
      fullTitle: fullTitle,
      duration: duration 
    };
    return entry;
}

MochaReport.prototype.getReport = function() {
    return this.report;
}

MochaReport.prototype.write = function(dest) {
    var mkdirp = require('mkdirp'),
        path = require('path'),
        fs = require('fs');    
    dest = dest || './target/report.json';
    var dir = path.dirname(dest);
    if (!fs.exists(dir)) {
        mkdirp(dir);
    }
    fs.writeFileSync(dest, JSON.stringify(this.report, null, 2), 'utf-8');
}

module.exports = MochaReport;