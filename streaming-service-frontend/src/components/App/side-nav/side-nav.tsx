"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useSelector } from "react-redux";
import LogoutButton from "../Artist/LogoutButton";
import styles from "./page.module.css";

const GET_USER_PROFILE_IMAGE = gql`
  query GetUserProfileImage($userId: ID!) {
    getUserById(_id: $userId) {
      profile_image_url
    }
  }
`;

const SideNav: React.FC = () => {
  const userId = useSelector(
    (state: { user: { userId: string | null } }) => state.user.userId
  );
  const userType = useSelector(
    (state: { user: { userType: "user" | "artist" | "admin" | null } }) =>
      state.user.userType
  );

  const { data, loading, error } = useQuery(GET_USER_PROFILE_IMAGE, {
    variables: { userId },
    skip: !userId,
  });

  const [homeRoute, setHomeRoute] = useState("/sound");
  const [searchRoute, setSearchRoute] = useState("/sound/search");

  useEffect(() => {
    const determineRoutes = () => {
      switch (userType) {
        case "artist":
          setHomeRoute("/artist/dashboard");
          setSearchRoute("/artist/search");
          break;
        case "user":
        case "admin":
        default:
          setHomeRoute("/sound");
          setSearchRoute("/sound/search");
          break;
      }
    };

    determineRoutes();
  }, [userType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const profileImageUrl =
    data?.getUserById?.profile_image_url
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${data.getUserById.profile_image_url}`
      : "/img/ellipse.png";

  return (
    <section className={styles.sideNav}>
      <header>
        <Link href={"/sound/soundProfile"}>
          <Image
            className="rounded-full border border-white"
            src={profileImageUrl}
            width={45}
            height={45}
            alt="Profile image"
          />
        </Link>
        <LogoutButton />
      </header>
      <nav>
        <ul>
          <li>
            <Link href={homeRoute}>
              <Image
                src="/icons/home-white.png"
                width={30}
                height={30}
                alt="Home icon"
              />
              Home
            </Link>
          </li>
          <li>
            <Link href={searchRoute}>
              <Image
                src="/icons/search-white.png"
                width={30}
                height={30}
                alt="Search icon"
              />
              Search
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default SideNav;

