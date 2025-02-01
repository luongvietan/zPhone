import React from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

const Navibar = () => {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/">
        <img
          src="../../public/logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="ZPHONE Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://thispersondoesnotexist.com/"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Viet An</span>
            <span className="block truncate text-sm font-medium">
              name@user.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link
          to="/"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          Home
        </Link>
        <Link
          to="/collection"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          Collection
        </Link>
        <Link
          to="/about"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          Contact
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navibar;
