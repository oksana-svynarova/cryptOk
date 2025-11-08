import './News.css';

function News() {
  return (
    <section className="section news">
      <h2 className="section__title">News</h2>
      <div className="error-wrapper">
        <p className="error__text_big">
          Whoops! Page Not Found
        </p>
        <div className="error__title">
          <svg className="error__icon" width="220" height="289">
            <use href="/sprite.svg#four"></use>
          </svg>
          <img src="/hamster.png" alt="Hamster" className="error__img" />
          <svg className="error__icon" width="220" height="289">
            <use href="/sprite.svg#four"></use>
          </svg>
        </div>
        <p className="error__text">
          This page doesn’t exist or was moved.
        </p>
      </div>
    </section>
  )
}

export default News;