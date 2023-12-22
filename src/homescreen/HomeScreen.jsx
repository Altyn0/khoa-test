import React, { useState, useEffect } from 'react';
import { List, Spin, Button, Modal, Tag } from 'antd';
import axios from 'axios';

const HomeScreen = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomQuote, setRandomQuote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [authorQuotes, setAuthorQuotes] = useState([]);
  const [authorModalVisible, setAuthorModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quotable.io/quotes');
        setQuotes(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
    setModalVisible(true);
  };

  const handleAuthorQuotes = authorName => {
    const quotesByAuthor = quotes.filter(quote => quote.author === authorName);
    setAuthorQuotes(quotesByAuthor);
    setSelectedAuthor(authorName);
    setAuthorModalVisible(true);
  };

  const handleAuthorModalClose = () => {
    setAuthorModalVisible(false);
    setSelectedAuthor(null);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <h1>Quote List from Khoa </h1>
      <Button type="primary" onClick={handleRandomQuote}>
        Random Quote
      </Button>
      <Spin spinning={loading}>
        <List
          itemLayout="vertical"
          dataSource={quotes}
          renderItem={quote => (
            <List.Item>
              <List.Item.Meta
                title={quote.content}
                description={
                  <div>
                    <button className='btn-name' onClick={() => handleAuthorQuotes(quote.author)}>
                      {quote.author}
                    </button>
                    <br />
                    {quote.tags && (
                      <div>
                        Tags:{' '}
                        {quote.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Spin>
      <Modal
        title="Random Quote"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {randomQuote && (
          <div>
            <p>{randomQuote.content}</p>
            <p>- {randomQuote.author}</p>
            {randomQuote.tags && (
              <div>
                Tags:{' '}
                {randomQuote.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title={`Quotes by ${selectedAuthor}`}
        visible={authorModalVisible}
        onCancel={handleAuthorModalClose}
        footer={null}
      >
        {authorQuotes.map(quote => (
          <div key={quote._id}>
            <p>{quote.content}</p>
            <p>- {quote.author}</p>
            {quote.tags && (
              <div>
                Tags:{' '}
                {quote.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default HomeScreen;
