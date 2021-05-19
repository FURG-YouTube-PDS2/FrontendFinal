import axios from "axios";
export const API_URL = "http://localhost:3334/";
// export const API_URL = "http://4e56b3328718.ngrok.io/";
// export const API_URL =
//   "http://ec2-18-216-193-215.us-east-2.compute.amazonaws.com:3334/";

export const getImg = (data) => {
  return axios.post(API_URL + "nin/imgs", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const registerUser = (data) => {
  return axios.post(API_URL + "users/signup", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const loginUser = (data) => {
  return axios.post(API_URL + "signin", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getProfile = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .post(API_URL + "users/profile", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const editProfile = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .put(API_URL + "users/profile/edit", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const uploadVideo = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "videos/send", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getUploadVideo = (data, token) => {
  return axios.post(API_URL + "videos/getData", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const checkEmail = (data) => {
  return axios.post(API_URL + "email/confirm_email", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const editPass = (data) => {
  //Ver com davi a necessidade de mandar o token:autho etc
  return axios.post(API_URL + "email/edit_pass", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const sendEmail = (data) => {
  return axios.post(API_URL + "email/send", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getVideo = (data) => {
  return axios.post(API_URL + "videos/get", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const watchVideo = (data) => {
  return axios.post(API_URL + "videos/watch", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const editVideo = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.put(API_URL + "videos/edit", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const deletVideo = (data) => {
  return axios.post(API_URL + "videos/delet", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const Inscribe = (data) => {
  return axios.post(API_URL + "users/subs", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const newLiked = (data) => {
  return axios.post(API_URL + "videos/liked", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const Report = (data) => {
  return axios.put(API_URL + "videos/report", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const sendComment = (data) => {
  return axios.post(API_URL + "comment/sendComment", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const editComment = (data) => {
  return axios.put(API_URL + "comment/edit_comment", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const commentLiked = (data) => {
  return axios.post(API_URL + "comment/liked", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const deletComment = (data) => {
  return axios
    .put(API_URL + "comment/delet_comment", data)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const getComment = (data) => {
  return axios.post(API_URL + "comment/getComment", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getVideos = (data) => {
  return axios.post(API_URL + "videos/get", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const myVideos = (data) => {
  return axios.post(API_URL + "videos/myVideos", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const feedVideos = (data) => {
  return axios.post(API_URL + "home/get", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const riseVideos = (data) => {
  return axios.post(API_URL + "home/rise", data).then(function (res) {
    let data = res.data;
    return data;
  });
};
export const historic = (data) => {
  return axios.post(API_URL + "home/historic", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getPlaylistWithVideoId = async (data) => {
  const res = await axios.post(API_URL + "playlist/list_videoid", data);
  return res.data;
};

export const addVideoToPlaylist = async (data) => {
  const res = await axios.post(API_URL + "playlist/add", data);
  return res.data;
};

export const removeVideoFromPlaylist = async (data) => {
  const res = await axios.post(API_URL + "playlist/remove", data);
  return res.data;
};

export const createPlaylist = async (data) => {
  const res = await axios.post(API_URL + "playlist/create", data);
  return res.data;
};

export const channelData = async (data) => {
  const res = await axios.post(API_URL + "channel/info", data);
  return res.data;
};

export const channelGetVideos = async (data) => {
  const res = await axios.post(API_URL + "channel/videos", data);
  return res.data;
};

export const getPlaylists = async (data) => {
  const res = await axios.post(API_URL + "playlist/get", data);
  return res.data;
};

export const listPlaylist = (data) => {
  return axios.post(API_URL + "playlist/list", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getNotf = (data) => {
  return axios.post(API_URL + "notification/get", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const readNot = (data) => {
  return axios.post(API_URL + "notification/edit", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const deletPlaylist = (data) => {
  return axios.post(API_URL + "playlist/delet", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const editPlaylist = (data) => {
  return axios.post(API_URL + "playlist/edit", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getRec = (data) => {
  return axios.post(API_URL + "recommended/get").then(function (res) {
    let data = res.data;
    return data;
  });
};
export const getRecs = (data) => {
  return axios.post(API_URL + "recommended/videos", data).then(function (res) {
    let data = res.data;
    return data;
  });
};
export const Registrations = (data) => {
  return axios.post(API_URL + "home/subs_videos", data).then(function (res) {
    let data = res.data;
    return data;
  });
};
export const Library = (data) => {
  return axios.post(API_URL + "home/lib_videos", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const SearchAll = (data) => {
  return axios.post(API_URL + "search", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const SearchInChannel = (data) => {
  return axios.post(API_URL + "search/channel", data).then(function (res) {
    let data = res.data;
    return data;
  });
};
export const getChartValues = (data) => {
  return axios.post(API_URL + "statistic/get", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const getPlaylistView = (data) => {
  return axios.post(API_URL + "playlist/view", data).then(function (res) {
    let data = res.data;
    return data;
  });
};
