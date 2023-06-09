import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import LatestWidget from "scenes/widgets/LatestWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import ServicesWidget from "scenes/widgets/ServicesWidget";
import InformationWidget from "scenes/widgets/InformationWidget";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";

const HomePage = () => {
  
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <motion.Box
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      <Navbar />
      <Box
        mt="70px"
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {/* check if user data is available */}
          {picturePath && _id ? (
            <UserWidget userId={_id} picturePath={picturePath} />
          ) : (
            <Skeleton variant="rectangular" height={140} />
          )}

          <Box m="2rem 0" />
          <ServicesWidget />
          <InformationWidget />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          {!isNonMobileScreens && (
            <>
              <br />
              <Box maxHeight={500} mx="auto">
                <LatestWidget />
              </Box>
            </>
          )}
          <PostsWidget userId={_id} />
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <LatestWidget />
            <br />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </motion.Box>
  );
};

export default HomePage;
