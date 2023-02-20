import { AnimatePresence, motion } from "framer-motion";

import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate, PathMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
  width: 60%;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 60%;
`;

const Slider = styled.div`
  width: 100%;
  position: absolute;
  bottom: 170px;
`;

const Row = styled(motion.div)`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  margin-right: 5px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  overflow: hidden;

  justify-content: center;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px 0px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  text-align: center;
  h4 {
    font-size: 10px;
  }
`;

const MovieCard = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  top: 100px;
  left: 0;
  right: 0;
  border-radius: 15px;
  overflow: hidden;
  margin: 0 auto;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  opacity: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CardCoverImg = styled(motion.div)<{ coverimg: string }>`
  width: 100%;
  height: 50%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
    url(${(props) => props.coverimg});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CardTitle = styled(motion.div)`
  position: absolute;
  color: ${(props) => props.theme.white.lighter};

  font-size: 32px;
  bottom: 10px;
  left: 5px;
`;

const BigOverview = styled(motion.div)`
  font-size: 18px;
  margin: 10px;
  div {
    color: ${(props) => props.theme.white.lighter};
    font-size: 25px;
    margin-bottom: 5px;
  }
`;

const rowVars = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: { x: 0 },
  exiting: { x: -window.innerWidth - 5 },
};

const BoxVars = {
  normal: { scale: 1 },
  hover: {
    zIndex: 2,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const InfoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:movieId");

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = data.results.length;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovie =
    moviePathMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === moviePathMatch.params.movieId
    );
  console.log(clickedMovie);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview} </Overview>
          </Banner>
          <Slider>
            <button onClick={increaseIndex}>aaa</button>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exiting"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={String(movie.id)}
                      variants={BoxVars}
                      whileHover="hover"
                      key={movie.id}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500" || "")}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={InfoVars}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {moviePathMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieCard layoutId={moviePathMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <CardCoverImg
                        coverimg={makeImagePath(
                          clickedMovie.backdrop_path,
                          "w500" || ""
                        )}
                      >
                        <CardTitle>{clickedMovie.title}</CardTitle>
                      </CardCoverImg>

                      <BigOverview>
                        <div>Overview</div>
                        <p>{clickedMovie.overview}</p>
                      </BigOverview>
                    </>
                  )}
                </MovieCard>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
