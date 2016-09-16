import json, os

with open("./scripts/payback.json", 'r+') as f:
    data = json.loads(f.read())
i = 0
json_out = {}
for key in data.keys():
    if u"image" in data[key].keys():
        for link in data[key][u"image"][u"output"]:
            with open('./public/assets/images_read_more/'+str(i)+'.jpg', 'w+'):
                cmd = ("curl -o './public/assets/images_read_more/"+str(i)+".jpg' " + link)
                os.popen(cmd)
                json_out[link] = '/assets/images_read_more/'+str(i)+'.jpg'
                i += 1
with open("./img2newimg.json", 'w+') as output:
    json.dump(json_out, output)
