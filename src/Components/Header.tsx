import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import styled from "styled-components";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  keyWord: string;
}

const Nav = styled(motion.nav)`
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 80px;
  top: 0;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.veryDark};
  font-size: 12px;
`;

const Logo = styled(motion.svg)`
  margin: 0px 50px;
  font-size: 30px;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 20px;
  position: relative;
`;

const ItemBar = styled(motion.div)`
  bottom: -5px;
  border-radius: 0.5px;
  height: 1.5px;
  width: 100%;
  position: absolute;
  background-color: ${(props) => props.theme.red};
`;

const SearchBox = styled(motion.form)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
  padding: 7px;
`;

const SearchInput = styled(motion.input)`
  background-color: transparent;
  border: transparent;
  overflow: hidden;
  outline: none;
  color: inherit;
  transform-origin: left center;
`;

const SearchIcon = styled(motion.svg)`
  width: 15px;
  height: 15px;
  fill: ${(props) => props.theme.white.lighter};
  margin: 0 5px;
`;

const logoVars = {
  normal: { fillOpacity: 1 },
  active: {
    fillOpacity: [0.2, 1],
    transition: { duration: 0.4 },
  },
};

function Header() {
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<IForm>();
  const onSearch = (data: IForm) => {
    navigate(`/search?keword=${data.keyWord}`);
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (scroll) => {
    if (scroll > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <Nav
      animate={{
        backgroundColor: scrolled ? "#141414" : "rgba(0,0,0,0)",
      }}
    >
      <Col>
        <Logo
          variants={logoVars}
          initial="normal"
          whileHover="active"
          xmlns="http://www.w3.org/2000/svg"
          width="3.72em"
          height="1em"
          viewBox="0 0 512 138"
        >
          <motion.path
            fill="#DB202C"
            d="M340.657 0v100.203c12.36.575 24.687 1.27 36.98 2.09v21.245a1822.444 1822.444 0 0 0-58.542-2.959V0h21.562ZM512 .012l-28.077 65.094l28.07 72.438l-.031.013a1789.409 1789.409 0 0 0-24.576-3.323l-15.763-40.656l-15.913 36.882a1815.88 1815.88 0 0 0-22.662-2.36l27.371-63.43L435.352.013h23.325l14.035 36.184L488.318.012H512ZM245.093 119.526V.011h60.19v21.436h-38.628v27.78h29.227v21.245h-29.227v49.05l-21.562.004ZM164.58 21.448V.01h66.69v21.437h-22.565v98.66c-7.197.19-14.386.412-21.56.683V21.448H164.58ZM90.868 126.966V.014h59.89v21.435h-38.331v29.036c8.806-.113 21.327-.24 29.117-.222V71.51c-9.751-.12-20.758.134-29.117.217v32.164a1848.195 1848.195 0 0 1 38.331-2.62v21.247a1815.638 1815.638 0 0 0-59.89 4.45ZM48.571 77.854L48.57.01h21.562v128.96c-7.882.81-15.75 1.673-23.603 2.584L21.56 59.824v74.802a1834.87 1834.87 0 0 0-21.561 2.936V.012H20.49l28.08 77.842Zm346.854 46.965V.012h21.563V126.6c-7.179-.64-14.364-1.23-21.563-1.78Z"
          />
        </Logo>
        <Items>
          <Item>
            <Link to="/">Home</Link>
            {homeMatch && <ItemBar layoutId="ItemBar" />}
          </Item>
          <Item>
            <Link to="/tv">Tv Shows</Link>
            {tvMatch && <ItemBar layoutId="ItemBar" />}
          </Item>
        </Items>
      </Col>
      <Col>
        <SearchBox
          onSubmit={handleSubmit(onSearch)}
          animate={{
            border: searchOpen ? "1px solid #fff" : "1px solid rgba(0,0,0,0)",
            transition: { delay: 0.2 },
          }}
        >
          <SearchIcon
            onClick={toggleSearch}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M23.832 19.641l-6.821-6.821c2.834-5.878-1.45-12.82-8.065-12.82-4.932 0-8.946 4.014-8.946 8.947 0 6.508 6.739 10.798 12.601 8.166l6.879 6.879c1.957.164 4.52-2.326 4.352-4.351zm-14.886-4.721c-3.293 0-5.973-2.68-5.973-5.973s2.68-5.973 5.973-5.973c3.294 0 5.974 2.68 5.974 5.973s-2.68 5.973-5.974 5.973z" />
          </SearchIcon>
          <SearchInput
            {...register("keyWord", { required: true, minLength: 2 })}
            animate={{
              width: searchOpen ? 180 : 0,
              scale: searchOpen ? 1 : 0,
              transition: { bounceDamping: 0 },
            }}
            placeholder="search for movie or Tv show"
          />
        </SearchBox>
      </Col>
    </Nav>
  );
}

export default Header;
