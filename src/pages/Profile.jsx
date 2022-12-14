import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { isUpdatedFalse, isUpdatedTrue } from "../redux/isUpdatedGlobal";
import Location from "../components/Location";
import Education from "../components/Education";
import Occupation from "../components/Occupation";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ProfilePage,
  ProfileMainDiv,
  ProfileUserBannerDiv,
  ProfileUserBannerInnerDiv,
  BannerFollowDiv,
  ProfileImage,
  AboutDiv,
  AboutInnerDiv,
  AboutInnerDivComponents,
  AddAboutInfoDiv,
  AddAboutInfoIcon,
  AboutDropDownDiv,
  AboutDropDownButton,
  DropDownIcon,
  DropUpIcon,
  RecentActivityDiv,
  ActivityPostsDiv,
} from "../styles/profile.styles";
const Profile = () => {
  const isUpdatedGlobal = useSelector((state) => state.isUpdatedGlobal.value);

  const dispatch = useDispatch();

  const [profileUser, setProfileUser] = useState();
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setlikedPosts] = useState([]);
  const [showAboutSection, setShowAboutSection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/in/${userId}`
      );
      await setProfileUser(response.data);
      await setUserPosts(response.data.posts);
      await setlikedPosts(response.data.likedPosts);

      console.log(response.data);
      await dispatch(isUpdatedTrue());
      await setIsLoading(false);
      await userPosts.sort(
        (x, y) => +new Date(y.createdAt) - +new Date(x.createdAt)
      );
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, isUpdatedGlobal]);

  return (
    <ProfilePage>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {profileUser && (
            <ProfileMainDiv>
              <ProfileUserBannerDiv>
                <ProfileUserBannerInnerDiv>
                  <ProfileImage src={profileUser.imageUrl} alt="profile pic" />
                  <BannerFollowDiv>
                    <p>{profileUser.followers.length} followers</p>

                    <p>{profileUser.following.length} following</p>
                  </BannerFollowDiv>
                </ProfileUserBannerInnerDiv>
                <h2>{profileUser.name}</h2>
              </ProfileUserBannerDiv>
              {(userId === user._id ||
                profileUser.about ||
                profileUser.occupation ||
                profileUser.occupation ||
                profileUser.occupation) && (
                <AboutDiv>
                  <h4>About</h4>
                  {user._id === userId && !profileUser.about ? (
                    <p>Complete your about section in the settings!</p>
                  ) : (
                    <p>{profileUser.about}</p>
                  )}

                  {showAboutSection && (
                    <AboutInnerDiv>
                      <AboutInnerDivComponents>
                        {profileUser.location && (
                          <Location location={profileUser.location} />
                        )}
                        {profileUser.education && (
                          <Education education={profileUser.education} />
                        )}
                        {profileUser.occupation && (
                          <Occupation occupation={profileUser.occupation} />
                        )}
                      </AboutInnerDivComponents>
                      {((user._id === userId && !profileUser.occupation) ||
                        (user._id === userId && !profileUser.education) ||
                        (user._id === userId && !profileUser.location)) && (
                        <AddAboutInfoDiv>
                          <Link to={`/edit/${userId}`} className="nav-link">
                            <AddAboutInfoIcon />
                          </Link>
                        </AddAboutInfoDiv>
                      )}
                    </AboutInnerDiv>
                  )}
                  {(profileUser.occupation ||
                    profileUser.occupation ||
                    profileUser.occupation) && (
                    <AboutDropDownDiv>
                      <AboutDropDownButton
                        onClick={() => {
                          setShowAboutSection(!showAboutSection);
                        }}
                      >
                        {showAboutSection ? <DropUpIcon /> : <DropDownIcon />}
                      </AboutDropDownButton>
                    </AboutDropDownDiv>
                  )}
                </AboutDiv>
              )}

              <RecentActivityDiv>
                <h4>Recent activity</h4>
                <ActivityPostsDiv>
                  {userPosts.length > 0 && (
                    <div>
                      <p>{profileUser.name} posted this</p>
                      <Post post={userPosts[0]} />
                    </div>
                  )}
                </ActivityPostsDiv>

                <Link to={`/in/${user._id}/activity`}>Check full activity</Link>
              </RecentActivityDiv>
            </ProfileMainDiv>
          )}
        </>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </ProfilePage>
  );
};

export default Profile;
