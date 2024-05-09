document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const comment = document.getElementById('comment').value;

    fetch('/submit-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, comment })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            window.location.href = '/comments'; // 重定向到显示评论的页面
        } else {
            alert('Failed to submit comment');
        }
    })
    .catch(error => console.error('Error:', error));
});
