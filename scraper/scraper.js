import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    downloadLink: String
});

const Book = mongoose.model('Book', BookSchema);

// Function to Scrape Books
async function scrapeBooks() {
    try {
        const { data } = await axios.get('https://www.gutenberg.org/browse/scores/top');
        const $ = cheerio.load(data);
        
        let books = [];

        $('li a').each(async (index, element) => {
            let title = $(element).text();
            let link = 'https://www.gutenberg.org' + $(element).attr('href');

            if (title && link.includes('/ebooks/')) {
                books.push({ title, author: 'Unknown', genre: 'Public Domain', downloadLink: link });
            }
        });

        // Save to MongoDB
        await Book.insertMany(books);
        console.log('✅ Books Scraped & Stored Successfully!');
    } catch (error) {
        console.error('❌ Error scraping:', error);
    }
}

scrapeBooks();
