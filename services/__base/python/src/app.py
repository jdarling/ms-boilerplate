from flask import Flask
from flask import jsonify
app = Flask(__name__)


def greet(name="World"):
    return f"Hello {name}!"


@app.route('/')
def defaultHello():
    print(f"Greet <default>")
    result = greet()
    return jsonify(result)


@app.route('/<name>')
def hello(name):
    print(f"Greet {name}")
    result = greet(name)
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
