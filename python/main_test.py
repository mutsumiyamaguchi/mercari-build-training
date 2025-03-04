from fastapi.testclient import TestClient
from main import app, get_db
import pytest
import sqlite3
import os
import pathlib

# STEP 6-4: uncomment this test setup
test_db = pathlib.Path(__file__).parent.resolve() / "db" / "test_mercari.sqlite3"

def override_get_db():
    conn = sqlite3.connect(test_db,check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@pytest.fixture(autouse=True)
def db_connection():
    # Before the test is done, create a test database
    conn = sqlite3.connect(test_db,check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute(
        """CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category_id INTEGER,
    image_name TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) --category_id = (table:categories) id 
)""")

    cursor.execute("""CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE --重複なし
)""")
       
    conn.commit()
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries

    yield conn

    conn.close()
    # After the test is done, remove the test database
    if test_db.exists():
        test_db.unlink() # Remove the file

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.mark.parametrize(
    "want_status_code, want_body",
    [
        (200, {"message": "Hello, world!"}),
    ],
)
def test_hello(want_status_code, want_body):
    response_body = client.get("/").json()
    response_status_code = client.get("/").status_code
    # STEP 6-2: confirm the status code
    # STEP 6-2: confirm response body
    assert response_body == want_body, f"unexpected result of test_hello: want={want_body}, got={response_body}"

    assert response_status_code == want_status_code,f"unexpected result of test_hello: want={want_status_code},got={response_status_code}"



# STEP 6-4: uncomment this test
@pytest.mark.parametrize(
    # 私がimageを受け取ることができるようにmain.py/itemsのpostを変更したときに、FormsとFilesの二つの引数を受け取るように変更したため、Filesを追加しました。
    # おそらく5-3でpostを実装してと言われていなかったため、本来であればpostが5-1のままであることが想定されていて、元のコードのままでテストを実行することができると思います。
    "args,files, want_status_code",
    [
        ({"name":"used iPhone 16e", "category":"phone"},{},422),#リクエストコンテンツの構文は正しいが、コンテンツに格納された指示を処理することができなかった
        ({"name":"", "category":"phone"},{"image":""} ,400),#リクエスト構文が不正であったり、リクエストメッセージのフレームが不正であったり、リクエストルーティングが不正
        ({"name":"used iPhone 16e", "category":"phone"},{"image":("default.jpg",open("images/default.jpg", "rb"))}, 200),#正しい
    ],
)
def test_add_item_e2e(args,files,want_status_code,db_connection):
    response = client.post("/items/", data=args,files = files)
    assert response.status_code == want_status_code
    
    if want_status_code >= 400:
        return
    
    
    # Check if the response body is correct
    response_data = response.json()
    assert "message" in response_data,f"unexpected result of est_add_item_e2e:want=the string of [message],got={response_data}"

    # Check if the data was saved to the database correctly
    cursor = db_connection.cursor()
    cursor.execute("SELECT * FROM items WHERE name = ?", (args["name"],))
    db_item = cursor.fetchone()
    name = args["name"]
    assert db_item is not None,"unexpected result of est_add_item_e2e:nothing saved to the database"
    assert dict(db_item)["name"] == args["name"],f"unexpected result of est_add_item_e2e:do not saved to the database {name}"
