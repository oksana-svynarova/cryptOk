import "./Footer.css"

function Footer() {
    return (
      <footer className="footer">
        <p className="footer__text">
          &#169; {new Date().getFullYear()} Oksana Svynarova. All Rights Reserved.
        </p>
      </footer>
    )
}

export default Footer;