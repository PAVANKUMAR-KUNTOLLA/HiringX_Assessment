import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import Page from "./../../components/Page";
import BlogPost from "../../components/BlogPost";
import Api from "../../components/Api";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const navigate = useNavigate();

  const url = Api.posts;

  const fetchPosts = async (offset) => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await axios.get(`http://localhost:8080${url}`, {
        params: { offset, limit: 9 },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setPosts([...posts, ...response.data]);
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Redirect to login page if unauthorized
      }
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 50) {
        fetchPosts(posts.length);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts]); // Include posts as a dependency

  return (
    <>
      <Page title="home">
        <div className="max-w-screen-xl mx-auto">
          <div
            className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 md:grid-cols-2 lg:ml-20 md:ml-10"
            style={{ marginTop: 0 }}
          >
            {posts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </Page>
    </>
  );
};

export default HomePage;
