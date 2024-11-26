const host = 'localhost'
const port = 3000


/*--------------common run variables--------------------------------------------------------------*/

const component = document.querySelectorAll('#part_2_setting div span');
component.forEach(ele => {
    if (ele.innerHTML.trim() === 'toggle_off') {
        ele.style.color = '#ff0000';
    } else {
        ele.style.color = '#02fd02';
    }
})

let current_date = () => {
    let usable = new Date();
    let h = usable.getHours();
    let m = usable.getMinutes();
    if (m < 10) {
        m = `0${m}`;
    };
    let date = usable.getDate();
    let month = usable.getMonth() + 1;
    let year = usable.getFullYear();
    let returnable = date + "/" + month + "/" + year + "   " + h + ":" + m;
    return returnable
}

const getuser = () => {
    let username = fetch(`http://${host}:${port}/requested/send/data/user/profile`)
        .then(res => res.json())
        .then(data => { return data.data });
    return username
}

/*------------------------------------------------------------------------------------------------*/
const mode = () => {
    if (document.getElementById("body").style.backgroundImage == `url("assets/bg-light.png")`) {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-dark.png)";
        document.getElementById("mode").innerHTML = "light_mode";

    } else {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-light.png)";
        document.getElementById("mode").innerHTML = "dark_mode";

    }
}

const add_comment = (a) => {
    let displays = document.getElementById(a).style.display;
    if (displays == 'flex') {
        document.getElementById(`_${a}_`).value = '';
        document.getElementById(a).style.display = 'none';
    } else {
        document.getElementById(a).style.display = 'flex'
    }
}

const like = (user, post_img) => {
    let colors = document.getElementById(`like_${post_img}`).style.color;
    if (colors == 'red') {
        document.getElementById(`like_${post_img}`).style.color = 'white';
    } else {
        document.getElementById(`like_${post_img}`).style.color = 'red'
    };
    if (document.getElementById(`like_${post_img}`).style.color === 'red') {
        fetch(`http://${host}:${port}/requested/send/data/user/profile`)
            .then(res => res.json())
            .then(current_username => {
                fetch(`http://${host}:${port}/liked-post-by/`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ posts: post_img })
                })
                    .then(res => res.json())
                    .then(data => {
                        let decision = true;
                        data.data[0].images.forEach(element => {
                            if (element.img === post_img) {
                                element.likes.forEach(ele => {
                                    if (ele === current_username.data) {
                                        decision = false;
                                    }
                                });

                            }
                        });
                        if (decision) {
                            fetch(`http://${host}:${port}/another-user-liked-post-by/${user}?posts=${post_img}`);
                            const Likes = document.getElementById(`likeCount${post_img}`)
                            const LikesValue = Number(Likes.innerHTML.split(' ')[0]) + 1
                            Likes.innerHTML = `${LikesValue} Likes`
                        }
                    })
            })
    }
}

const dblclick = (user, post_img) => {
    document.getElementById(`like_${post_img}_`).style.animation = 'pop_in 300ms'
    document.getElementById(`like_${post_img}_`).style.display = 'block';
    setTimeout(() => {
        document.getElementById(`like_${post_img}_`).style.animation = 'pop_out 200ms 800ms';
    }, 300)
    setTimeout(() => {
        document.getElementById(`like_${post_img}_`).style.display = 'none'
    }, 1300)
    if (document.getElementById(`like_${post_img}`).style.color != 'red') {
        like(user, post_img)
        const Likes = document.getElementById(`likeCount${post_img}`)
        const LikesValue = Number(Likes.innerHTML.split(' ')[0]) + 1
        Likes.innerHTML = `${LikesValue} Likes`
    }
}

const post_comment = (user, image) => {
    let comment = document.getElementById(`_input_${image}_`).value.trim();
    fetch(`http://${host}:${port}/another-user-commented-post-by`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ username: `${user}`, posts: `${image}`, com: `${comment}` })
    });
    document.getElementById(`input_${image}`).style.display = 'none';
    document.getElementById(`_input_${image}_`).value = '';
    const Comments = document.getElementById(`commentCount${image}`)
    const CommentsValue = Number(Comments.innerHTML.split(' ')[0]) + 1
    Comments.innerHTML = `${CommentsValue} Comments`
}

const screen = (area) => {
    document.getElementById(area).style.display = 'block';
    let screens = ['home', 'user', 'upload', 'setting'];
    let a = screens.indexOf(area);
    screens.splice(a, 1);
    for (i = 1; i <= (screens.length + 1); i++) {
        if (i === (a + 1)) {
            document.querySelector(`#nav div:nth-child(2) div:nth-child(${i}) a`).className = 'material-symbols-rounded';
            document.querySelector(`#nav div:nth-child(2) div:nth-child(${i}) a`).style.color = 'blue';
        } else {
            document.querySelector(`#nav div:nth-child(2) div:nth-child(${i}) a`).className = 'material-symbols-outlined';
            document.querySelector(`#nav div:nth-child(2) div:nth-child(${i}) a`).style.color = 'white';
        }
    }
    screens.forEach((part) => {
        document.getElementById(part).style.display = 'none';
    });
    if (area === 'upload') {
        document.getElementById('back').style.display = 'none'
    } else {
        document.getElementById('back').style.display = 'block'
    }
}

const full_screen = (img, comments) => {
    console.log('Comments array:', comments); // Debug comments array
    console.log('Array length:', comments.length);

    let comment_section = document.getElementById('comments');
    comment_section.innerHTML = ''; // Clear existing comments

    document.querySelector('.img_selection').src = img;

    const fullScreen = document.getElementById('full_screen');
    fullScreen.style.animation = 'full_screen_in 300ms';
    fullScreen.style.display = 'flex';

    document.getElementById('back').style.opacity = '0%';

    document.querySelectorAll('.content_img_class span').forEach(ele => {
        ele.style.opacity = '0%';
    });

    document.querySelectorAll('.hide').forEach(ele => {
        ele.style.opacity = '0%';
    });

    comments.forEach(ele => {
        if (!ele || !ele.username || !ele.comment) {
            console.warn('Skipping invalid comment:', ele);
            return;
        }

        const div = document.createElement('div');
        const p1 = document.createElement('p');
        p1.textContent = ele.username;

        const p2 = document.createElement('p');
        p2.textContent = "-";

        const p3 = document.createElement('p');
        p3.textContent = ele.comment;

        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);

        console.log("Appended div:", div); // Debug each div
        comment_section.appendChild(div); // Fallback to appendChild
        console.log("Comments container after append:", comment_section.innerHTML);
    });
};


const exit = () => {
    document.getElementById('full_screen').style.animation = 'full_screen_out 300ms';

    setTimeout(() => {
        document.getElementById('full_screen').style.display = 'none';
        document.querySelectorAll('.content_img_class span').forEach(ele => {
            ele.style.opacity = '100%'
        });
        document.querySelectorAll('.hide').forEach(ele => {
            ele.style.opacity = '100%';
        });
        document.getElementById('back').style.opacity = '100%';
    }, 300);
}

const delete_account = () => {
    let confirmation = confirm("Are you sure that you want to delete this account?");
    if (confirmation) {
        fetch(`http://${host}:${port}/delete/account-delete/`)
            .then(location.replace(`http://${host}:${port}/`))
    }
}

const message_show = (msg, color) => {
    let success_id = document.getElementById('success_id');
    success_id.style.backgroundColor = color;
    success_id.innerHTML = msg;
    success_id.style.display = 'flex';
    success_id.style.animation = 'success_in 300ms';
    setTimeout(() => {
        success_id.style.animation = 'success_out 300ms';
    }, 3000)
    setTimeout(() => {
        success_id.style.display = 'none';
    }, 3300)
}



/* ----------------------eventlisteners-------------------------- */

document.getElementById('setting_input_value').addEventListener('change', () => {
    document.getElementById('choose_profile_img').innerHTML = 'Image selected';
    document.getElementById('setting_input_value_button').addEventListener('click', () => {
        message_show('Profile Updated Successfully', 'rgb(0, 255, 13)')
        document.getElementById('choose_profile_img').innerHTML = 'Click to choose a New Profile Picture.'

    })
})

let background = document.getElementById('background');
let font = document.getElementById('font');
let button = document.getElementById('button');


/* font */
font.addEventListener('change', () => {
    document.getElementById('body').style.color = font.value;
})

/* button */
button.addEventListener('change', () => {
    document.querySelectorAll('input[type="submit"]').forEach(ele => {
        ele.style.backgroundColor = button.value;
    });

    document.querySelectorAll('button').forEach(ele => {
        ele.style.backgroundColor = button.value;
    });

    document.querySelectorAll('.reactions button').forEach(ele => {
        ele.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    })
})

/* updating eventlisteners */
document.getElementById('update_fn_btn').addEventListener('click', () => {
    let fn_value = document.getElementById('update_fn').value.trim();
    fetch(`http://${host}:${port}/update-fn/${fn_value}`, {
        method: 'POST'
    });
    message_show("First Name updated Successfully!", 'rgb(0, 255, 13)');
    document.getElementById('update_fn').value = '';
})

document.getElementById('update_ln_btn').addEventListener('click', () => {
    let ln_value = document.getElementById('update_ln').value.trim();
    fetch(`http://${host}:${port}/update-ln/${ln_value}`, {
        method: 'POST'
    });
    message_show("Last Name updated Successfully!", 'rgb(0, 255, 13)');
    document.getElementById('update_ln').value = '';
})

document.getElementById('update_un_btn').addEventListener('click', () => {
    let un_value = document.getElementById('update_un').value.trim();
    fetch(`http://${host}:${port}/update-un/${un_value}`, {
        method: 'POST'
    });
    message_show("Username updated Successfully!", 'rgb(0, 255, 13)');
    document.getElementById('update_un').value = '';
})

document.getElementById('update_bio_btn').addEventListener('click', () => {
    let bio_value = document.getElementById('update_bio').value.trim();
    fetch(`http://${host}:${port}/update-bio/${bio_value}`, {
        method: 'POST'
    });
    message_show("Bio updated Successfully!", 'rgb(0, 255, 13)');
    document.getElementById('update_bio').value = '';
})

document.getElementById('update_pwd_btn').addEventListener('click', () => {
    let pwd_value = document.getElementById('update_pwd').value.trim();
    fetch(`http://${host}:${port}/requested/send/data/user/profile`)
        .then(res => res.json())
        .then(data => {
            fetch(`http://${host}:${port}/user?username=${data.data}`)
                .then(res => res.json())
                .then(new_data => {
                    if (document.getElementById('old_pwd').value.trim() === new_data[0].password) {
                        document.getElementById('password_error').style.display = 'none';
                        if (document.getElementById('update_pwd').value.trim() === document.getElementById('update_pwd_cpwd').value.trim()) {
                            document.getElementById('password_error').style.display = 'none';
                            fetch(`http://${host}:${port}/update-pwd/${pwd_value}`, {
                                method: 'POST'
                            });
                            message_show("Password updated Successfully!", 'rgb(0, 255, 13)');
                            document.getElementById('old_pwd').value = '';
                            document.getElementById('update_pwd').value = '';
                            document.getElementById('update_pwd_cpwd').value = '';
                        } else {
                            document.getElementById('password_error').style.display = 'block';
                        }
                    } else {
                        document.getElementById('password_error').style.display = 'block';
                    }
                })

        })
})

document.getElementById('upload_input_value').addEventListener('change', () => {
    document.getElementById('choose_post_img').innerHTML = 'Image Selected';
    document.getElementById('upload_input_value_button').addEventListener('click', () => {
        document.getElementById('choose_post_img').innerHTML = 'Click to choose an Image';
        document.getElementById('upload_input_value_caption').innerHTML = '';

        message_show('Post uploaded successfully', 'rgb(0, 255, 13)')
    })
})

document.getElementById('main_home').addEventListener('load', () => {
    if (document.getElementById('main_home').childElementCount === 0) {
        document.getElementById('no_content').style.display = 'block';
    } else {
        document.getElementById('no_content').style.display = 'none';
    }
})

document.getElementById('home_icon').addEventListener('click', () => {

    render();
    document.getElementById('main_home').innerHTML = '';
})

document.getElementById('user_icon').addEventListener('click', () => {

    setup();
    load_profile_img();
    document.getElementById('posts').innerHTML = '';
})

const load_profile_img = () => {
    fetch(`http://${host}:${port}/requested/send/data/user/profile`)
        .then(res => res.json())
        .then(data => {
            fetch(`http://${host}:${port}/user?username=${data.data}`)
                .then(res => res.json())
                .then(new_data => {
                    profile_post(new_data.data[0].images)
                });
        })
}


const profile_post = (img_list) => {
    if (img_list.length === 0) {
        document.getElementById('empty_post').style.display = 'block';
    } else {
        document.getElementById('empty_post').style.display = 'none';
        img_list.forEach(ele => {
            const post = document.getElementById('posts');
            const div = document.createElement('div');
            div.id = ele._id;
            const image = document.createElement('img');
            const span = document.createElement('span');
            image.src = ele.img;
            image.onclick = () => { full_screen(ele.img, ele.comments) };
            image.alt = ele.img;
            span.classList = 'material-symbols-rounded hide';
            span.textContent = 'delete';
            span.onclick = () => { delete_post(ele._id) };
            div.appendChild(image);
            div.appendChild(span);
            post.appendChild(div);
        })

    }
}

const delete_post = (id) => {
    fetch(`http://${host}:${port}/requested/send/data/user/profile`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                fetch(`http://${host}:${port}/delete-post/${id}`)
                    .then(document.getElementById(id).remove())
                    .then(setup())
            }
        })
}

const logout = () => {
    fetch(`http://${host}:${port}/logout`, { method: 'GET' })
}

const setup = () => {
    fetch(`http://${host}:${port}/requested/send/data/user/profile`)
        .then(res => res.json())
        .then(data1 => {
            fetch(`http://${host}:${port}/user?username=${data1.data}`)
                .then(res => res.json())
                .then(new_data => {
                    document.getElementById('profile_img').src = new_data.data[0].profile_img;
                    document.getElementById('user_name').innerHTML = `${new_data.data[0].firstname} ${new_data.data[0].lastname}`;
                    document.getElementById('user_username').innerHTML = new_data.data[0].username;
                    document.getElementById('user_bio').innerHTML = new_data.data[0].bio;
                    document.getElementById('post_stat').innerHTML = new_data.data[0].images.length;
                    let likes = 0;
                    for (i of new_data.data[0].images) {
                        likes += i.likes.length;
                    };
                    let comments = 0;
                    for (i of new_data.data[0].images) {
                        comments += i.comments.length;
                    };
                    document.getElementById('like_stat').innerHTML = likes;
                    document.getElementById('comment_stat').innerHTML = comments;
                    if (new_data.data[0].verified) {
                        document.getElementById('profile_verified').style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
        .catch(error => {
            console.error(error)
        })
}

const render = () => {
    fetch(`http://${host}:${port}/showalluserdata`)
        .then(res => res.json())
        .then(data1 => {
            fetch(`http://${host}:${port}/requested/send/data/user/profile`)
                .then(res => res.json())
                .then(newData => {
                    homepage(data1.data, newData.data)
                })
        })
}

const homepage = (data, username) => {
    data.forEach(element => {
        if (element.images.length !== 0) {
            element.images.forEach(ele => {
                const home = document.getElementById('main_home');

                const li_main = document.createElement('li');
                li_main.className = 'li_content';

                const div_content = document.createElement('div');
                div_content.className = 'content';

                const span_like = document.createElement('span');
                span_like.className = 'material-symbols-rounded';
                span_like.innerHTML = 'favorite';
                span_like.id = `like_${ele.img}_`;
                span_like.style.position = 'absolute';
                span_like.style.transform = 'translate(-200px, 80px)';
                span_like.style.color = 'red';
                span_like.style.fontSize = '90px';
                span_like.style.display = 'none';

                const div_content_img_class = document.createElement('div');
                div_content_img_class.className = 'content_img_class';

                const span_fullscreen = document.createElement('span');
                span_fullscreen.textContent = 'fullscreen';
                span_fullscreen.className = 'material-symbols-rounded';
                span_fullscreen.onclick = () => { full_screen(ele.img, ele.comments) }

                const image_content_img = document.createElement('img');
                image_content_img.className = 'content_img';
                image_content_img.src = ele.img;
                image_content_img.alt = 'image';
                image_content_img.ondblclick = () => { dblclick(element.username, ele.img) };

                const div_details = document.createElement('div');
                div_details.className = 'details';

                const p_profile = document.createElement('p');
                p_profile.className = 'profile_info';

                const image_profile_img = document.createElement('img');
                image_profile_img.src = element.profile_img;
                image_profile_img.alt = 'image';

                const span_profile_username = document.createElement('span');
                span_profile_username.textContent = element.username;

                const span_verified = document.createElement('span');
                span_verified.classList = 'material-icons visible';
                span_verified.innerHTML = 'verified'

                const p_caption = document.createElement('p');
                p_caption.className = 'caption';
                p_caption.textContent = ele.caption;

                const div_reaction_details = document.createElement('div');
                div_reaction_details.className = 'reactions_details';

                const p_post_date = document.createElement('p');
                p_post_date.textContent = ele.date;

                const p_dot1 = document.createElement('p');
                p_dot1.textContent = ' • ';

                const p_likes = document.createElement('p');
                p_likes.id = `likeCount${ele.img}`
                p_likes.textContent = `${ele.likes.length} Likes`;

                const p_dot2 = document.createElement('p');
                p_dot2.textContent = ' • ';

                const p_comments = document.createElement('p');
                p_comments.id = `commentCount${ele.img}`
                p_comments.textContent = `${ele.comments.length} Comments`;

                const div_reactions = document.createElement('div');
                div_reactions.className = 'reactions';

                const button_like = document.createElement('button');
                button_like.id = `like_${ele.img}`;
                button_like.className = 'material-symbols-rounded';
                button_like.textContent = 'favorite';
                ele.likes.includes(username) ? button_like.style.color = 'red' : button_like.style.color = 'white'
                button_like.style.transition = '300ms';
                button_like.onclick = () => { like(element.username, ele.img) };

                const button_comment = document.createElement('button');
                button_comment.className = 'material-symbols-rounded';
                button_comment.textContent = 'add_comment';
                button_comment.onclick = () => { add_comment(`input_${ele.img}`) };

                const div_input = document.createElement('div');
                div_input.id = `input_${ele.img}`;
                div_input.style.display = 'none';
                div_input.style.justifyContent = 'center';
                div_input.style.alignContent = 'center';
                div_input.style.marginTop = '20px'

                const div_comment = document.createElement('div');
                div_comment.className = 'comment';

                const input_comment = document.createElement('input');
                input_comment.type = 'text';
                input_comment.id = `_input_${ele.img}_`
                input_comment.placeholder = 'Add Comment...';

                const button_post_comment = document.createElement('button');
                button_post_comment.onclick = () => { post_comment(element.username, ele.img) };
                button_post_comment.textContent = 'Post';

                home.appendChild(li_main);

                li_main.appendChild(div_content);

                div_content.appendChild(span_like);

                div_content.appendChild(div_content_img_class);

                div_content_img_class.appendChild(span_fullscreen);

                div_content_img_class.appendChild(image_content_img);

                div_content.appendChild(div_details);

                div_details.appendChild(p_profile);

                p_profile.appendChild(image_profile_img);

                p_profile.appendChild(span_profile_username);

                if (element.verified) {
                    p_profile.appendChild(span_verified);
                };

                div_details.appendChild(p_caption);

                div_details.appendChild(div_reaction_details);

                div_reaction_details.appendChild(p_post_date);

                div_reaction_details.appendChild(p_dot1);

                div_reaction_details.appendChild(p_likes);

                div_reaction_details.appendChild(p_dot2);

                div_reaction_details.appendChild(p_comments);

                div_content.appendChild(div_reactions);

                div_reactions.appendChild(button_like);

                div_reactions.appendChild(button_comment);

                li_main.appendChild(div_input);

                div_input.appendChild(div_comment);

                div_comment.appendChild(input_comment);

                div_comment.appendChild(button_post_comment);
            })

        };
        if (document.getElementById('main_home').childElementCount === 0) {
            document.getElementById('no_content').style.display = 'block';
        }
        if (document.getElementById('main_home').childElementCount != 0) {
            document.getElementById('no_content').style.display = 'none';
        }
    });
}

