const WordCount = require("../model/WordCount");
const cheerio = require("cheerio");
const axios = require("axios");
const urlLib = require("url");

exports.getWordCount = async (req, res, next) => {
  let { url, userId } = req.body;

  var parsedUrl = urlLib.parse(url);

  // Get word count from website
  try {
    const { wordCount, imageLinks, externalLinks } = await processWordCount(
      url
    );

    //creating wordcount object
    const wc = new WordCount(
      userId,
      parsedUrl.hostname,
      wordCount,
      externalLinks,
      imageLinks
    );
    const result = await wc.create();
    if(result.insertedId){
      res.status(200).json(wc);
    }else {
      res.status(500).json({eror: "Internal Server Erro"});
    }
    
  } catch (error) {
    //  console.error("Error processing word count:", error);
    res.status(400).json({ error: error });
  }
};

function processWordCount(url) {
  // Fetch website HTML using axios

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
       
        const $ = cheerio.load(response.data);

        // Find word count
        const text = $("p").text();
        const wordCount = text.split(/\s+/).length;

        // Find all image links
        const imageLinks = [];
        $("img").each(function () {
          const imageUrl = $(this).attr("src");
          if (imageUrl) {
            const absoluteImageUrl = urlLib.resolve(url, imageUrl);
            imageLinks.push(absoluteImageUrl);
          }
        });

        // Find all external links
        const externalLinks = [];
        $("a").each(function () {
          const href = $(this).attr("href");
          if (
            href &&
            !href.startsWith("#") &&
            !href.startsWith("javascript:")
          ) {
            const absoluteUrl = urlLib.resolve(url, href);
            if (!absoluteUrl.startsWith(url)) {
              externalLinks.push(absoluteUrl);
            }
          }
        });

        resolve({ wordCount, imageLinks, externalLinks });
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          reject("Url is not responding")
          return
        } else if (error.request) {
          // The request was made but no response was received
          console.log(Object.keys(error));
          reject("Given Url is not found");
          return;
        }
        reject("Internal Server Error");
      });
  });
}

exports.addToFavorites = (req, res, next) => {

 const {state} = req.body;
  const historyId = req.params.id;
 
  WordCount.addToFavourite(historyId,state)
    .then((result) => {
      if (result) {
        res.status(200).send({ msg: "favourite state updated" });
      } else {
        res.status(404).send({ error: "given id is not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: "Internal  Error" });
    });

};

exports.deleteHistoryById = (req, res, next) => {

  const historyId = req.params.id;
  WordCount.delete(historyId)
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).send({ msg: "history deleted" });
      } else {
        res.status(404).send({ error: "given id is not found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: "Internal  Error" });
    });
};



// exports.getHistory =  async (req, res) => {
//   const { page, perPage } = req.query;
//   const totalCount = await WordCount.countDocuments();
//   const items = await WordCount.find()
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * perPage)
//     .limit(parseInt(perPage));
//   res.json({ items, totalCount });
// };

exports.getHistory = (req, res, next) => {
  const userId = req.params.id;

  WordCount.getAll(userId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ error: "Internal  Error" });
    });
};
