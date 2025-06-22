import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
const __dirname = import.meta.dirname;
const notesDir = path.join(__dirname, '../notes');

export class NotesController {
    async index(req, res) {
        try {
            const [networkArray, hardwareArray, softwareArray] = await this.getNotes();
            const queryName = req.query.name;

            if(!queryName){
                return res.render('shownote' , {
                    contentHtml: null,
                    network: networkArray,
                    hardware: hardwareArray,
                    software: softwareArray
                })
            }

            const contentHtml = await this.cleanHtml(queryName);

            res.render("shownote", {
                noteName: queryName,
                contentHtml: contentHtml,
                network: networkArray,
                hardware: hardwareArray,
                software: softwareArray
            });
        } catch (err) {
            console.error("could not list dir", err);
        }

    };

    async getNotes(req, res) {
        try {
            const files = await fs.readdir(notesDir);
            const network = files.filter(file => file.startsWith('1')).map(name => name.slice(3, -3));
            const hardware = files.filter(file => file.startsWith('2')).map(name => name.slice(3, -3));
            const software = files.filter(file => file.startsWith('3')).map(name => name.slice(3, -3));
            return [network, hardware, software];
        } catch (err) {
            console.error("could not list dir", err);
        }
    };

    async cleanHtml(queryName) {
        let contentHtml = null;
        if (queryName) {
            const files = await fs.readdir(notesDir);
            const match = files.find(f => f.includes(queryName));
            if (!match) {
                return res.status(404).send('Note not found');
            }

            const md = await fs.readFile(path.join(notesDir, match), 'utf-8');
            contentHtml = marked.parse(md);
            return sanitizeHtml(contentHtml, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
                allowedAttributes: {
                    a: [ 'href', 'name', 'target' ],
                    img: [ 'src', 'alt' ]
                }
            });
        }

    };

};

export const notesController = new NotesController();
