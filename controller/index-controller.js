export class IndexController {
    index(req, res) {
        res.render("index");
    };
}

export const indexController = new IndexController();
