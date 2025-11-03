export const issues = [
  {
    id: 1,
    title: "Học sinh bị dị ứng với món ăn",
    description:
      "Học sinh Nguyễn Minh Anh bị dị ứng với món pudding trứng trong bữa phụ chiều nay.",
    category: "food",
    severity: "high",
    student: "Nguyễn Minh Anh",
    date: "23/10/2023",
    time: "14:30",
    status: "pending",
    responses: [],
  },
  {
    id: 2,
    title: "Thiết bị trong lớp học bị hỏng",
    description:
      "Máy chiếu trong lớp học không hoạt động, cần được sửa chữa để phục vụ giảng dạy.",
    category: "facility",
    severity: "medium",
    student: "",
    date: "22/10/2023",
    time: "09:15",
    status: "inProgress",
    responses: [
      {
        id: 1,
        text: "Đã tiếp nhận thông tin, nhân viên kỹ thuật sẽ đến kiểm tra vào ngày mai.",
        date: "22/10/2023",
        time: "10:30",
        user: {
          name: "Nguyễn Văn Quản",
          role: "Quản lý cơ sở vật chất",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Học sinh cần hỗ trợ tâm lý",
    description:
      "Học sinh Lê Thu Hà có dấu hiệu tâm lý không ổn định, cần được tư vấn và hỗ trợ.",
    category: "health",
    severity: "medium",
    student: "Lê Thu Hà",
    date: "20/10/2023",
    time: "15:45",
    status: "resolved",
    responses: [
      {
        id: 1,
        text: "Đã tiếp nhận thông tin và sắp xếp buổi tư vấn với chuyên gia tâm lý vào ngày 21/10.",
        date: "20/10/2023",
        time: "16:30",
        user: {
          name: "Trần Thị Hương",
          role: "Chuyên viên tâm lý",
        },
      },
      {
        id: 2,
        text: "Buổi tư vấn đã diễn ra tốt đẹp, học sinh đã ổn định hơn. Sẽ tiếp tục theo dõi trong tuần tới.",
        date: "21/10/2023",
        time: "14:00",
        user: {
          name: "Trần Thị Hương",
          role: "Chuyên viên tâm lý",
        },
      },
    ],
  },
  {
    id: 4,
    title: "Đề xuất thay đổi hoạt động ngoại khóa",
    description:
      "Đề xuất tổ chức thêm hoạt động trồng cây xanh cho học sinh để tăng cường ý thức bảo vệ môi trường.",
    category: "activity",
    severity: "low",
    student: "",
    date: "18/10/2023",
    time: "11:20",
    status: "resolved",
    responses: [
      {
        id: 1,
        text: "Cảm ơn cô đã đề xuất. Nhà trường sẽ xem xét và đưa vào kế hoạch hoạt động tháng tới.",
        date: "19/10/2023",
        time: "08:45",
        user: {
          name: "Nguyễn Hoàng",
          role: "Quản lý trường",
        },
      },
    ],
  },
];

export const feedbackItems = [
  {
    id: 1,
    title: "Món ăn quá mặn",
    description:
      "Bữa trưa hôm nay có món canh chua quá mặn, nhiều học sinh không ăn được.",
    date: "23/10/2023",
    time: "13:45",
    sender: {
      name: "Nguyễn Thị Hương",
      role: "Giáo viên lớp 2A",
      avatar: "https://i.imgur.com/6YQ9Z3z.jpg",
    },
    status: "pending",
    severity: "high",
    category: "food",
    dish: "Canh chua cá lóc",
    responses: [
      {
        id: 1,
        text: "Cảm ơn cô đã phản hồi. Chúng tôi sẽ điều chỉnh lại lượng muối trong món canh chua.",
        date: "23/10/2023",
        time: "14:30",
        user: {
          name: "Nguyễn Thị Tâm",
          role: "Quản lý bếp",
          avatar: "",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Dị ứng với món tráng miệng",
    description:
      "Học sinh Trần Minh Anh lớp 3B bị dị ứng với món pudding trứng hôm nay. Em có biểu hiện nổi mẩn đỏ.",
    date: "22/10/2023",
    time: "12:15",
    sender: {
      name: "Lê Thị Mai",
      role: "Giáo viên lớp 3B",
      avatar: "https://i.imgur.com/KWaVOLR.jpg",
    },
    status: "inProgress",
    severity: "high",
    category: "allergy",
    dish: "Pudding trứng",
    responses: [],
  },
  {
    id: 3,
    title: "Đề xuất thêm rau xanh",
    description:
      "Phụ huynh đề xuất tăng cường rau xanh trong bữa trưa để cân bằng dinh dưỡng cho học sinh.",
    date: "21/10/2023",
    time: "16:30",
    sender: {
      name: "Phạm Văn Tuấn",
      role: "Phụ huynh học sinh",
      avatar: "https://i.imgur.com/F8QXfXh.jpg",
    },
    status: "resolved",
    severity: "medium",
    category: "suggestion",
    dish: "Chung",
    responses: [
      {
        id: 1,
        text: "Cảm ơn góp ý của phụ huynh. Chúng tôi sẽ điều chỉnh thực đơn để tăng cường rau xanh trong các bữa ăn sắp tới.",
        date: "22/10/2023",
        time: "08:45",
        user: {
          name: "Nguyễn Thị Tâm",
          role: "Quản lý bếp",
          avatar: "",
        },
      },
    ],
  },
  {
    id: 4,
    title: "Khen ngợi món mới",
    description:
      "Món cơm gà rau củ hôm nay rất ngon và được các học sinh yêu thích. Mong nhà trường duy trì món này.",
    date: "20/10/2023",
    time: "13:00",
    sender: {
      name: "Trần Văn Nam",
      role: "Giáo viên lớp 4A",
      avatar: "https://i.imgur.com/wgJDypg.jpg",
    },
    status: "resolved",
    severity: "low",
    category: "compliment",
    dish: "Cơm gà rau củ",
    responses: [
      {
        id: 1,
        text: "Cảm ơn thầy đã phản hồi tích cực. Chúng tôi sẽ tiếp tục duy trì món ăn này trong thực đơn.",
        date: "20/10/2023",
        time: "15:20",
        user: {
          name: "Nguyễn Thị Tâm",
          role: "Quản lý bếp",
          avatar: "",
        },
      },
    ],
  },
  {
    id: 5,
    title: "Thức ăn không đủ nóng",
    description:
      "Bữa trưa hôm nay thức ăn không đủ nóng, đặc biệt là món canh. Mong nhà bếp khắc phục.",
    date: "19/10/2023",
    time: "12:45",
    sender: {
      name: "Nguyễn Thị Lan",
      role: "Giáo viên lớp 1C",
      avatar: "https://i.imgur.com/6YQ9Z3z.jpg",
    },
    status: "resolved",
    severity: "medium",
    category: "food",
    dish: "Canh rau củ",
    responses: [
      {
        id: 1,
        text: "Cảm ơn cô đã phản hồi. Chúng tôi sẽ kiểm tra lại thiết bị giữ nhiệt và đảm bảo thức ăn luôn được phục vụ nóng.",
        date: "19/10/2023",
        time: "14:00",
        user: {
          name: "Nguyễn Thị Tâm",
          role: "Quản lý bếp",
          avatar: "",
        },
      },
    ],
  },
];

export const parentFeedbacks = [
  {
    id: 1,
    parent: {
      name: "Nguyễn Thị Hương",
      avatar: "https://i.imgur.com/6YQ9Z3z.jpg",
      child: "Nguyễn Minh Anh",
      class: "3A",
    },
    rating: 5,
    comment:
      "Con tôi rất thích món cơm gà rau củ và luôn xin thêm. Tôi đánh giá cao việc nhà trường cập nhật thực đơn đa dạng.",
    date: "24/10/2023",
    dish: "Cơm gà rau củ",
    childFeedback: "Con rất thích món cơm gà, ăn hết suất và còn xin thêm!",
  },
  {
    id: 2,
    parent: {
      name: "Trần Văn Minh",
      avatar: "https://i.imgur.com/F8QXfXh.jpg",
      child: "Trần Hoàng Nam",
      class: "2B",
    },
    rating: 4,
    comment:
      "Thực đơn đa dạng và đầy đủ dinh dưỡng, con tôi đã tăng cân đều đặn từ khi sử dụng dịch vụ bán trú của trường.",
    date: "23/10/2023",
    dish: "Bún chả cá",
    childFeedback: "Con thích nhất bữa phụ với các loại trái cây tươi.",
  },
  {
    id: 3,
    parent: {
      name: "Lê Thị Mai",
      avatar: "https://i.imgur.com/KWaVOLR.jpg",
      child: "Lê Thu Hà",
      class: "1A",
    },
    rating: 3,
    comment:
      "Món ăn khá ngon nhưng đôi khi hơi mặn đối với trẻ nhỏ. Mong nhà trường điều chỉnh lượng gia vị phù hợp hơn.",
    date: "22/10/2023",
    dish: "Bún riêu cua",
    childFeedback: "Con đã bớt kén ăn hơn khi ở trường!",
  },
  {
    id: 4,
    parent: {
      name: "Phạm Văn Tuấn",
      avatar: "https://i.imgur.com/wgJDypg.jpg",
      child: "Phạm Tuấn Kiệt",
      class: "3A",
    },
    rating: 5,
    comment:
      "Tôi rất hài lòng với thực đơn và cách chăm sóc của nhà trường. Con tôi luôn hào hứng kể về bữa ăn ở trường.",
    date: "21/10/2023",
    dish: "Cơm sườn kho",
    childFeedback: "Con thích nhất món sườn kho, rất ngon!",
  },
  {
    id: 5,
    parent: {
      name: "Vũ Thị Hồng",
      avatar: "https://i.imgur.com/6YQ9Z3z.jpg",
      child: "Vũ Hoàng Long",
      class: "2B",
    },
    rating: 4,
    comment:
      "Đánh giá cao việc nhà trường quan tâm đến chế độ ăn chay cho con tôi. Mong có thêm nhiều món chay hơn nữa.",
    date: "20/10/2023",
    dish: "Món chay",
    childFeedback: "Con rất thích món đậu phụ sốt cà chua!",
  },
];
