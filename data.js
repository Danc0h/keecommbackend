import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Brilliant Cherop",
      email: "Brilly@gmail.com",
      password: bcrypt.hashSync("345678"),
      isAdmin: true,
    },
    {
      name: "Dancun Kipkorir",
      email: "dancoh@gmail.com",
      password: bcrypt.hashSync("765432"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Checked B&W Flannel",
      slug: "Checked_B&W_Flannel",
      category: "Flannels",
      discountPercentage: 22,
      image: "/Images/flannel-8.jpg",
      price: 500,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton flannel for stylish wear ",
      variants: [
        {
          color: "Black and white",
          size: "M",
          countInStock: 20,
        },
      ],
      reviews: [
        {
          user: "John Kerry",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "Stripped G&R Flannel",
      slug: "Stripped_G&R_Flannel",
      category: "Flannels",
      image: "/Images/flannel-5.jpg",
      discountPercentage: 22,
      price: 500,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton flannel for stylish wear ",
      variants: [
        {
          color: "Green and Red",
          size: "M",
          countInStock: 2,
        },
      ],
      reviews: [
        {
          user: "John Kerry",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "White Cotton Hoodie",
      slug: "White_Cotton_Hoodie",
      category: "Hoodies",
      image: "/Images/hoodie-3.jpeg",
      price: 600,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton hoodie for stylish wear ",
      variants: [
        {
          color: "Black and white",
          size: "M",
          countInStock: 20,
        },
      ],
      reviews: [
        {
          user: "John Kerry",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "Quality Black Hoodie",
      slug: "Quality Black Hoodie",
      category: "Hoodies",
      image: "/Images/hoodie-2.jpg",
      price: 600,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton hoodie for stylish wear ",
      variants: [
        {
          color: "Black and white",
          size: "M",
          countInStock: 5,
        },
      ],
      reviews: [
        {
          user: "John Kerry",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },

    {
      name: "Stripped Blue Flannel",
      slug: "Stripped_Blue_Flannel",
      category: "Flannels",
      image: "/Images/flannel-9.jpg",
      price: 500,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton flannel for stylish wear ",
      variants: [
        {
          color: "Blue",
          size: "M",
          countInStock: 5,
        },
      ],
      reviews: [
        {
          user: "Brilliant Cherop",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "Checked W&B Flannel",
      slug: "Checked_W&B_Flannel",
      category: "Flannels",
      image: "/Images/flannel-6.jpg",
      price: 500,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton flannel for casual wear ",
      variants: [
        {
          color: "White and blue",
          size: "M",
          countInStock: 5,
        },
      ],
      reviews: [
        {
          user: "Brilliant Cherop",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "Stripped Lightblue Flannel",
      slug: "Stripped_Lightblue_Flannel",
      category: "Flannels",
      image: "/Images/flannel-7.jpg",
      price: 500,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton flannel for casual wear ",
      variants: [
        {
          color: "White and blue",
          size: "M",
          countInStock: 5,
        },
      ],
      reviews: [
        {
          user: "Brilliant Cherop",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
    {
      name: "Grey Cotton Hoodie",
      slug: "grey_Cotton_Hoodie",
      category: "Hoodies",
      image: "/Images/hoodie-3.jpeg",
      price: 600,
      countInStock: 3,
      brand: "Flannels KE",
      description: "High quality cotton hoodie for stylish wear ",
      variants: [
        {
          color: "Black and white",
          size: "M",
          countInStock: 20,
        },
      ],
      reviews: [
        {
          user: "John Kerry",
          rating: 4,
          comment: "Very comfortable and stylish. Highly recommended!",
        },
      ],
    },
  ],
};

export default data;
