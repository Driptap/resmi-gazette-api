import cheerio from 'cheerio';
import { constructDateUrl, getPromise } from './helpers';

const isSectionHeader = text =>
  text.indexOf('B') > -1
    && text.indexOf('L') > -1
    && text.indexOf('M') > -1;

class Day {

  constructor(body) {
    this.body = cheerio.load(body, {
      decodeEntities: true,
    });
  }

  get rawSections() {
    let sections = [];

    this.body('.MsoNormal').each((i, sp) => sections.push(sp))

    return sections;
  }

  get sections() {
    let headings = {};

    let sections = this.sectionHeadings(this.rawSections);
    // console.log(this.rawSections)
    return sections.reduce((col, sp) => ({
      ...col,
      [this.sectionHeader(sp)]: this.section(sp)
    }), {});
  }

  sectionHeader(sp) {
    /** Identifies heading structure */
    let secHeader = this.body(sp).find('u b font');
    if (!secHeader.text())
      secHeader = this.body(sp).find('span b u font');

    let text = secHeader.text();
    return text;
  }

  sectionHeadings(rawSections) {
    return rawSections
      .filter(sec => isSectionHeader(this.body(sec).text()))
      .map(sec => this.body(sec).text());
  }

  section(sectionHeading) {
    let secRes = {
      links: [],
    };
    let headerP = this.body(header).parentsUntil('p');
    while(headerP.next('p').text()) {
      let secLinks = headerP.find('a');
      if (secLinks.length) {
        secLinks.each((idx, link) =>
          this.body(link).attr('href').indexOf('pdf') > -1 &&
            secRes.links.push({
              text: this.body(link).text(),
              href: this.body(link).attr('href'),
            }));
      }

      headerP = headerP.next('p');
    }
    return secRes;
  }

}

/** Scraper function */
const scrape = date => new Promise((res, rej) => {
    getPromise(constructDateUrl(date))
      .then((response, body) => res({ [date]: new Day(response).sections }))
      .catch(err => console.error(err));
  });

export default scrape;
