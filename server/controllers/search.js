import Article from '../models/Article';

class SearchController {
  async searchFunc(req, res) {
    const { search } = req.query;
    try {
      const regex = new RegExp(search, 'i');
      const searchedArticle = await Article.find().or([
        { text: { $regex: regex } },
        { name: { $regex: regex } },
        { tags: { $regex: regex } },
        { 'comments.text': { $regex: regex } },
        { 'comments.name': { $regex: regex } }
      ]);
      res.status(200).json({
        status: 200,
        searchedArticle
      });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
}

export default SearchController;
