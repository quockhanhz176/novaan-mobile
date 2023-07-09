import type Post from "../types/Post";

const getNextPost = (): Post =>
    ({
        id: "1",
        title: "Cách làm bánh kem (bánh gato) dâu tây tại nhà",
        description:
            "Bánh kem thường xuất hiện trong những bữa tiệc sinh nhật hay những ngày vui trong các gia đình và hội bạn thân nên được rất nhiều người yêu thích. Hôm nay Điện máy XANH sẽ vào bếp góp vào niềm vui của mọi người bằng món bánh kem (bánh gato) dâu tây thơm ngon nhé!",
        video: "https://v.pinimg.com/videos/mc/720p/f6/88/88/f68888290d70aca3cbd4ad9cd3aa732f.mp4",
        type: "recipe",
        difficulty: 1,
        portionQuantity: 1,
        portionType: 1,
        prepTime: { hour: 0, minute: 30 },
        cookTime: { hour: 0, minute: 30 },
        instructions: [
            {
                step: 1,
                description:
                    "Sơ chế dâu tây: Dâu tây ngâm với nước muối loãng khoảng vài phút sau đó rửa sạch, để ráo và cắt đôi, bỏ cuống.",
            },
            {
                step: 2,
                description:
                    "Dâu tây sau khi đã sơ chế, bạn chừa lại khoảng 4 trái để trang trí, phần còn lại thì bạn trộn cùng 100gr đường để khoảng 30 phút rồi mang đi nấu. Nấu dâu tây trên lửa vừa đến khi dâu tây mềm nhũn. Sau đó bạn đem lọc qua rây, dùng thìa miết nhuyễn dâu và lọc bỏ phần bã. Đem bọc kín mứt và để ngăn mát tủ lạnh.",
            },
        ],
        ingredients: [
            {
                name: "bột mì đa dụng",
                amount: 110,
                unit: "gram",
            },
            {
                name: "tinh bột bắp",
                amount: 30,
                unit: "gram",
            },
        ],
        creator: {
            username: "Điện máy XANH",
            userId: "123332",
        },
    } as any);

const reelServices = {
    getNextPost,
};

export default reelServices;
