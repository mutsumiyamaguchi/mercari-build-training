FROM python:3.12-alpine

# 作業ディレクトリを作成
WORKDIR /app

# sqliteを追加
RUN apk add --no-cache sqlite

# ローカルの現在のディレクトリ（buildしたところ）をコンテナの作業ディレクトリにコピー
COPY . .

# requirements.txtを実行し必要なものをインストール
RUN pip install --no-cache-dir -r requirements.txt

# ポート9000に設定
EXPOSE 9000

# 実行
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]