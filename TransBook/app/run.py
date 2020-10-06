from flask import Flask, render_template, redirect, abort,jsonify, url_for, session, make_response, request
from flask_restful import Resource, Api
from json import JSONEncoder
import json
import os

app=Flask(__name__)
api=Api(app)
app.config['SECRET_KEY']=os.environ.get('KEY')



class Order:
    def __init__(self,title,price):
        self.title=title
        self.price=price
    def toJSON(self):
        return json.dumps(self,default=lambda o: o.__dict__, sort_keys=True,indent=4)


@app.route('/')
@app.route('/home')
def index():
    if session:
        print(session['prices'])
        cart_total_list=[float(price) for price in session['prices']]
        cart_total=sum(cart_total_list)
        cart_qty_list=[qty for qty in session['qts']]
        cart_length=sum(cart_qty_list)

    else:
        cart_total=0.0
        cart_length=0
    return render_template('index.html', title='Home', cart_total=cart_total, cart_length=cart_length)

@app.route('/cart', methods=['GET', 'POST'])
def cart():
    if session:
        for item,price in zip(session['titles'],session['prices']):
            print(item,price)
        cartItems=zip(session['titles'],session['prices'],session['qts'])
        cart_total_list=[float(price) for price in session['prices']]
        cart_qty_list=[qty for qty in session['qts']]
        cart_length=sum(cart_qty_list)
        #cart_length=len(cart_total_list)
        # print('cart_length ='+str(cart_length))
        # print('cart_qty ='+str(cart_qty))
        # print(sum(cart_total_list))
        cart_total=sum(cart_total_list)+((cart_length+6)//6)*100
    else:
        cart_total,cart_length,cartItems=0.0,0,''
    if request.method =='POST':
        return redirect('')
    return render_template('cart.html',cartItems=cartItems, title='Cart', cart_total=cart_total, cart_length=cart_length)

@app.route('/success')
def success():
    return render_template('success.html', title='Paid Successfully')

class PostEntry(Resource):
    def post(self):
        order_titles=[]
        order_prices=[]
        order_qts=[]
        req=request.get_json()
        order=Order(req['title'], float(req['price']))
        if not session:
            order_titles.append(order.title)
            order_prices.append(order.price)
            order_qts.append(1)
        else:
            order_titles=session['titles']
            order_prices=session['prices']
            order_qts=session['qts']
            if order.title in order_titles:
                corres_pos=order_titles.index(order.title)
                order_qts[corres_pos]+=1
                order_prices[corres_pos]+=+order.price
            else:
                order_titles.append(order.title)
                order_prices.append(order.price)
                order_qts.append(1)
        session['titles']=order_titles
        session['prices']=order_prices
        session['qts']=order_qts
        #  print (json.dumps(order, default=obj_2_json))
        return order.toJSON()


class DeleteEntry(Resource):
    def post(self):
        req=request.get_json()
        if session:
            if req in session['titles']: 
                corres_pos=session['titles'].index(req)
                print(corres_pos)
                session['titles'].remove(req)
                session['qts'].pop(corres_pos)
                session['prices'].pop(corres_pos)
                session.modified=True
                print('/n')
                print('/n')
                print(session['titles'])
                print(session['prices'])
                print(session['qts'])
                if not session['titles']:
                    session.clear()
                #  print (json.dumps(order, default=obj_2_json))
        return req

api.add_resource(PostEntry, '/session/entry')
api.add_resource(DeleteEntry, '/session/entry/delete')
if __name__=='__main__':
    app.run(debug=True)