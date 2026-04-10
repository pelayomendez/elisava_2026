from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/hello", methods=["GET", "POST"])
def hello():
    if request.method == "GET":
        return jsonify({"message": "Hello world"})

    data = request.get_json()
    name = data.get("name", "")
    return jsonify({"message": f"Hello {name}"})


if __name__ == "__main__":
    app.run(debug=True)
