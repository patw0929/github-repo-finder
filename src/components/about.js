import React from 'react';

const About = () => {
  return (
    <div className="well">
      <h2>關於</h2>

      <h3>動機</h3>

      <p>這是個人練習的小專案，並也希望做個小工具，解決臨時想找個曾經看過的 GitHub 專案但熊熊又想不起來的窘境。（年紀漸長，該吃銀杏了）</p>

      <p>這個小專案能為這些專案下個 tag，或是看看別人下的 tag，往後要尋找就更能有跡可循。</p>

      <hr />

      <h3>技術</h3>

      <ul>
        <li>Web API 架設於 Heroku。</li>
        <li>Web App 架設於 GitHub Pages。</li>
        <li>react v15.1.0</li>
        <li>redux, react-redux</li>
        <li>react-router</li>
        <li>redux-form</li>
        <li>react-tagsinput</li>
        <li>Node.js, postgreSQL, gatekeeper</li>
        <li>GitHub API</li>
        <li>...等開源專案。</li>
      </ul>

      <hr />

      <h3>作者</h3>

      <p>
        <a href="https://github.com/patw0929" target="_blank">patw (Patrick Wang)</a>，
        網站前端工程師。
      </p>
    </div>
  );
};

export default About;
