<template>
    <view class="page">
		
		<view class="search">
		    <image class="search-icon" src="../../static/mine/icon_search.png"></image>
		    <input v-model="searchKey" placeholder="输入手机号或昵称" placeholder-style="color: #999999" confirm-type="search" @confirm="search" />
		</view>
		
        <view v-if="list.length>0" class="user-list">
            <view class="user" v-for="(user,index) in list" :key='index'>
                <view class="user-left">
					<view class="avatar-container">
					    <image mode="aspectFill" lazy-load class="avatar" :src="user.headImg" v-if="user.headImg"></image>
					    <image class="avatar" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAgAElEQVR4Xu19CXNc13XmOfd1YyWxkSABsCESIiXbpCVZsmTHsiKLpuVVVuJNUxMnNclkamqSTFXyA2aq/AOmpmaqJnGlxpOlJsnU0JEUyZIsieYimlopURJp0pZIiguABrGQWEgQS/e7Z+prvsO5bDWA3vFeo2/Vq9cNdL/lvq+/s5/LtIaGiMTOnDnjtba2evF43EulUo3GmPUispGINorIBhHpYOYOIurCXkQ6RaSNiFqNMc0i0khEDUQUJ6JYsDdE5BNRmohSRLRIRAvBXt/PEdGsiEwy8yQRXRGRKWbGdpmIJph5wlp7NR6PL6RSKX92dtbfsWOHz8w47poYvCbukojOnTvXFIvFWpi5hYgyG8BojGkPgKhgbCcibABl5jUzr8fnRaSJiABIgBFbrvmzARABSoBRNwDyOhFNE9FUsE2LyLSCEsC01k4DlMFnr4vI9XQ6fX1gYGB+LTyrNQHIZDK50Vqb8Dyvz1rby8y9ItLDzJuZudMBGwAH9gPolAl1DxYsZYBBXfYEgyqLzjMzAAcATorIKDNfEpERY8yI7/tJY8xQX1/fRCkXEIXv1hwgwYTNzc1tYLV0Ot0mIl3GmF4i6heRLczcJyJ9ACURbSIigDBMA8AcAxiZOSkiSWYeJqJBay3+diUWi82IyNW5ubmZWmPOmgLkhQsXOj3P2+p53g4R2UFEAwEbQh+ErrgOuiAR6T5MQMy+llkiuga9k5mvAYAAI4AKDYSZz/i+j+3C1q1boZPWxIg0IEUkfunSpY50Ot0Rj8e7RGSriGwXkTuZ+U4i2k5E3URUqrgNy8OGfjpORGdF5ENmxnaWmS+kUikw51RPTw+MJKgGkRyRBeTJkycbOjs7tzPzLiLaJSIDItLPzF2wkIMNTFiLA8x5JbDUrzDzIDOfI6KTInJycnLy7K5du2BURW5ECpAA4caNGzt934crJkFEO40xnxGRzxDRNiKCgbIWB0T2eWZ+z1r7HhGdYuYhz/MmZ2Zmpu644w4YT5EYkQEkwLhhw4Y7rbX3MPNd0BEBSmbuIaLNITROqg0AGEOjInIJYISOKSInjDHHr169+mFUQBlqQIqIOX/+fFtLSwv0w23W2s8w8wMich8R3VYH4ZKYBzghxo8R0VHf99+Lx+Pnrl+/fmXbtm0zzAxdNJQj1IAcHh7uN8aADe+FnhgYKVuICC6bWjFUKgUMgA4WOVxGZ6FfMvO71toTW7ZsGazUSUs9bugAifDeyMhIh7V2i+d591hrP8/Mv0VEdxARIib1UfgMIPJzWkTeMMa86fv+cTjae3t7YZGHKiwZKkCKCI+Njd2eTqcfIKLPMvPd8CXCqV0Xz4WjMOsbGTEOHyYRnRCRd6y1RxOJBNxGUvLRy3SAUAASrDg0NNTmeR7Adz8RfSnYbw1CeWW63fphEGdn5otE9LaIHMLe9/1ziUQCuuWqs2UoADk6Onq77/tw3XyRiKAvIsoCXbGuJ1bmNwRGHAp0Sxg+r3qe997mzZs/qszp8j/qqgJyfHx8ve/7W33ff4CZwYoPBSK6DsT8n2Epn4ThAxF+RERe8TzvaDwev7hhw4aZUg5ayndXDZCXLl3aZK29FwaLiHyeiD4VOLdLuZ/6d4ubgfNE9GsReYuZYfgc6+npGSvuUKV9q+qARPx5YmJi4+Li4gPGmEdF5EEi+mSQo1ja3dS/XcoMIFfzA2Z+1Vq7r6Gh4ejGjRuRNFzVuHjVATkyMrIzAOHDgeECQyZsKWClPNgofxeWONjyKBEdZubXent7T1XzhqoGSOQpNjY2bmPmPSLyTbh1aiwTp5rPrZLngsEDcf0OM78gIvsXFhbOVyvvsiqAPH36dOO6devuEZEvE9EeIronAGMlJ7Z+7NJmAGlu7xPRfmY+cO3atferEQ+vOCADZtxJRN8QkccCZzdqWuoj/DOAkorjzPwcEf18YWHhVKWZsqKAHBsbW5dKpZCd83UR+QqydIKM7fA/ivoV6gygUvIEM/9CRF6Mx+Pvb9q0CfmYFRkVA+SlS5da0+n03caYx4joWyKyk5lRqVcfEZsBEUkxM4yb5621z8ViseM9PT0osSj7qAggk8kkRDJSxGC8fI2IPl0PAZb92VX7gMhA/xURvURELxDRsb6+PriKyjrKDkjojE1NTUgZ+x0iAjsibQwF9fUR/RlArPskET3HzM/Mz8+fKLdOWVZABkVXiEl/U0S+RUTI1kFdc33UzgygHAKGzvNgyp6envfK6TwvGyCRsXPp0qU7ReRxIvpO4NqpGTAyl2eqREKT6VXKTwSghEvoaWZ+tqenB9WPZckUKs8sIzV5ZGSntfYrxpjHRQQJtah/jvxwgbjU6+Vu0gXgUq8jOkmoF3/DWvusMeYX5YrolAxI1L0MDg72xGIx6IvfIyIk10a6+s8FnoIom9nyZbpsZtX3uc4RQWCi2hFhxid9338+kUigs0ZJ9TolA3JoaChhjAEIv09Ej0Y5AqMgMeZG9pu1NrP5vn9z078BkNkbvoNjZG84nud5pHu8xqbnwzEx8gV5yICLiM4+gNJa+1YikUCeZdGjJEAinzGdTj+MCAwRPUJE6BYRuVxGBUa2SAUQ0+k0pVKpm3sFpwITewWmC0iATzeALxaLZbZ4PH5zj//nUgMiBkz8mj4kokOI6MRiscPd3d2o4SlqFA3IwcHBZrQrYebvMTOMmNujmEKmbIbZA9gUfApEBWU2SwI0CkaX3VyRrIBzmRGgVIBi7wIU7/VYEQMl/JEficjTIvIk2rz09/ej/WDBoyhAwqJOJpNoYwJWBBiRStZc8NlX8QsAjqsfAlwA48LCAs3Pz9Pi4mLmfTYDLqVTLnUr2Tqj/gAAUoCzsbGRmpqaMnuAM5s1V3GKCj01AHgYljdqdfr6+lA8VrDlXRQg0WWsoaEBybU/ICJY1GhrEpnh6ohgQoBPN4BQwQhWdEc5rWwcVxmyoaEhA0bsFZgAK67TVQciMMHQH99g5p8uLi7uK6YrW8GADPyN94rI7wVWdR/mNgKTdfMSlR0BPrDh9evXM3u8z2WoLAXKQu55KRGsjIhrAiibm5uppaXlJjBdJi/kfKv0WfyCkzBwmPmfenp63i2UJQsCpIh4yWRyB7J3iAjsiPKDgo6xShN10/IFMJQVAcK5ubmMmAYrqrWbyzVTqet2GRDgBEtChOsGxlSLPCJsCc//a0T0U2QH9fX1nWHmW0XNMpNZEJjQGpmIAEa4eL4QdKCt1LMq63EVZAAjQAhWxB6sCNGczWDlisysdBO5zgsAApjKlgAnRLgaPCsdMwT/R8b560T0z0QEUObdijpvQAYZPKgM/H0i+m5QNx16Ua1GhBotLhhdVlS9crUfprK0C0oAExtEei4X1Wpfc47zgxHRU+hpIvoHtAfMNzMoL0AGnSUGPM+DVf2EiHwpKrmNrr44OztL2CCqwYr68DGh1WLElcDjMqZribe2thI2BWXY3ULIoTTGHBaRvdbaQ1u2bPkoH30yL0DCAZ5KpVALAxcPCvrR4iTUw2USMCFENMCoYrqaemIxE+UCDuIaDAlAqsGjP7SQAxMtW14hoqfi8fj+fBzmeQFycHDwDmPMHzDzD9DDOwrsmM2M165du4UZXYd4MYCpxnfUiFHHOnTJ9evX32TKsOuUQaY5+qH/1Fr7v/v7+0+vNG/LAhKJE0NDQx2xWAzdJf5tkAEeage4Ag0PE8wIRrx69WpmD4NGR1hE9EoPKJspwZLr1q27RacMufUNh/kLzPw36XT6jUQigRaASyZgLAtI1MUQEbK/4QSHuEYjqFAPBSTABxENZoS4xnvojGExXgqdRL126JAQ2wAl9hDnIQckbhX+SOROIgnjxHL1OCsBcpPv+98OYtVok4de3qEdbvYMfIszMzMZQIIpo8aM2ZOsTIl7hEsIgIT4hhiPgPN8FG3/iOhfjDFI6F2yb9BKgPy0tfaPg4gM2iiHtjYmG4xgRVdvjCozZgMTTAmXEIwcABIsCYCG3B0EXQntpZ8yxvykp6cHxWI5R05AQnecnJxcv7CwgPZ4/z5ofRJaMLpuG4hmABGb6o1gl1oCpBtmVCMnAqI7zcw/J6K/bmxsPNLZ2YmVyT6mS+YEZOAER0eyrwYhQpS0hnqo2IKonp6ezhgyiMJEXVQvJbrxdzAjANne3p6JfWOE3A30LhHtJaKXieg3uZzlOQE5NDS0wRiDbhOPG2MewmKVYUaj6+IBK0J3hEED8RYF904xc6tGDqxuABKiW/MpizleNb4TLCb6KhE9Y619MZFIYJ3wW0ZOQA4ODu7wPO+PghAhEm+xZG8oh2tVA4xqVWtYsFZEdS5dEvcOZoSBg00TMULMlLAu0Tb6Kd/3/7a/v//MioBEp7LW1lbUyPwJEX077EtxKCABQIhpbBDbmlgbFX9job92iGbcG35w6jAHKCHGMdywaKHHrvDn0RfoWSL68ezs7NHsjmq3MCTSy4aHh3s9z/ty4AhHmDDUQwEHdlTdUR3gtQpG94EAmPBNAowdHR033UAhBiQu/xU4yq21B/v6+rAe+M30tFsAqQ2imPkbzIyMHrRBCf3A5MPNA0BCZNey7phLdEN3hC4JQEKX1EzzED+4U6i9QWqa53nvu47yWwA5Pj7em06nEZVBFSHqZELrCHf9jpo8AWMGTFlLbp6VQKXGDfySbW1tUfFLwlH+y6BK8eXu7m74KDPjFkAGSRQ/ZObfDdaKCW33CTfhFulka8WYycWQYEQYNBpShE7pVjCuBOpV+D+qFLHU3TMi8o+JRAJltB8H5MjIyOdE5E+JCIDEuoKhrbFW6xnsCBcPjBnNc1SFfxUmuuqn1HuFYxxAVIsb7/GjDakuCYc4arcRSvxxT0/Pm7cAEmsMDg0NNcVisd0i8mdBVk/VJ7eQE7qAVGMG4NREg7Vg0GC+XGtbY9wQ3RpODCkgM5eONtHM/FfpdPpAIpGYx5qLGZEdLI6+xVr7NRH5Q2bGQkahHgpIuHgmJyczznBY12sFiLkeDlgRkRu1tvGZEAMSP6Y3jTF/z8wvXr58eXjXrl2LjLj1xMREayqVQl9HFHBBXKNJfaiHWpIQ01euXMmIbJQl1KojfKWHAeApIDs7OzPJF2EHJGptILZhbcfj8fc2btw4C0DGx8fHN6RSqd3MjCajqJvBwpehHhouhFUNQMKoASDDHj6r1KTqvYMhu7q6MgZOBACJQrBDIvJ8PB4/2N3dfZkRmWlra4O4/o6IIDIDpmyv1MSV67iqsMP/ODU1VQdk8GOEP1IBCWkRZpFNRNNEhA68PzPGPD0zMzPMQVb47dbaPyQi9AVHAVeoU80U1JhsWNgAJIAZ5YzwUn+oeu9gRohsADMCDnLkSV5AsoUx5u8Q5+Zz5851NDc3f8JaC+saDNlR6uRU6/tapgCDpg7IG+UZAKRGbDRHslrPo8jzTBERGPIv5+bmPuDBwcEtxphdzPznwRIeoS7+dyM0LiChS9YZ8gYgNR1Nu12EvMQBceyXROS/W2tPMnqDYx2ZwP+IcGGohwtIJOCCGTVkWAdkJAEJvGHl2b+EBxKAhFWNJYNR5ooVWkM93F+7C8i6yL5VZMPtowwZ6gd64+Kw8uzfwA0EQKKL2SdF5Ilgxa1QX78LSIhszfKpA/LjOmSEXGC/Qk9JlDUAkH8mIugNDh/k9lCjMevi4HtTQGrJwlp1jKsfMoJGDZ7qWayjKCKnAcj/LCI7iAhrWUeqE67mQcLtUwfkjaAA3D1w+0QkL1IpBp13DzDzGU4mk/+VmbcHix1tigpDquhWP2Q9UnMDkIjUKCBDnO2TDTPtJ/kRAPkTERlgZpS6RsYHqU5fiGwkV2gsO0J6U1l/+yqykemDSE1EYtk6B1MicoyZzwGQUCa3BQkVNwKgERiqK8L/CJGt2T5rTYfU9DOoL6itASCjku3jwAwJu0i0OA9AopvAVuiRUWizpzehwEO2j9bSuD18IvCbKsslusnIyBqHyNaePzhByGPZmTnQtn0IIwKQvySi24ioPyoN7HET6iCHL1KbSq2F8tdsFCsgoaq4GeNgy+BhlwX4FT4IknUHsQGQ7wRg7K7wSct6eLemRls1a9u9tVjCAABq22fXKR7y1iouJrBmYgaQWCEe7IgamsgMN4QIsa29IJUl14ouqeFSt7uu2w0tMg/0Ro3NIPyQqP4CICO12Lrbfm4tR2zctDPN8omopwGLwg+BIc8HDvFQZ/ks9Ut3M8fdzhVriSERs9bOFZopHiFRrY8WlYgZQMJLju5meTXAD5sIcIu9YNxgWwvWdi7rGi4fbcsXBes6G0vojgZAwkseKYPGvREFZHajUu0NWatViNouxu05DqNGM3yiCEgiGgcgrxBRZ9iYL9/ryW6posZNrSfsui1U3NbO+gONoMjGI58EINE0sitfAIT1cwAmwmewuCG2EUoEa9aqLqmRGeiOyBCHlR2BGpqV4DMNQKLxT2SSKpa6I7eTBcAIUAKc6hyuFdGtuiPuR109YMgI9IVcCYw3GRJGDVZYCG0fn3zuRBuXgiW1k64uCeI+xHyOFdbP4D5UVGuYEHojHOHKjhEV1TrlGR0SLXbRGCC0bZvzBYi6gDRxF0yJ6A0MHAVsvscK4+e0b5FGZWBV69LFEQdiZrrVyv5NEKmJTKbPcmBRUAKES3VFi5r4dlfq0oU4o7TmYZ4/blQfZvyQxwNARiYXciVA4v8QbQgjZi9JHEWmVEDqgkm6rBz0xohb1e6jRPezDCAjmVyxXOTmpuvf2oxh44JS/XNRAKbLjACju+KCC0Y13PJkorB+bCYTyx4eHn7dGHNb2NeiKXQWFXBw/WR32IWOGSVAKhgRFoQRE4EOuYU+LnweAZpMts+hIB8SPX0ibWm7s6CAA8soKGHgwALXTruBIh26npLZOiMACDDCmgZLuvXWtWDMBM1Lsdh7BpAvBA2mUHkYeUs7G5T6HqwInRKgVGAqUyowi/lZl/s7LsA06RasqItshrx3eFHTEWSMYxGliwAk1p7TmprQNrkv6k6dzHJ8X0EJhgQosYc17i79u1oWuMuKuAboiGBGsKKC0Y061Qgz6mNFTQ3ycjMlDP+TmQdEBFWHkY1p52N5q/UNECooIcJdUKqBUC1gZme347zwMwKIqi9CRNcwGDHlk8x8TEQyVYf/JehY8YUwr0tTLEPmEuGqV0KEA5DYA5TYwKIuY1ZCnOvxlRUBNohiABHMiM3VF91k5HLMQwiPgfD16+hgAUD+p2BNGnSuQOZ4TQ/34QIQACEACcYEOJFLCVBWc6gVDRBCTAOQAKfrCagxEZ09vSjwOkBEZ1DC8Cfo7cPMjwUtVar5LFbtXNlWOECJDYCEVY4NwMSmC3kuZTAtdxMuG+o5lREBRIhjZUZY0ACjrjHj6pWrNlFVODFaqKDPODN/CIb8HrqfEdG/IqK7qnD+0JzCZUsFHYAI1gQwlxLlxd4AzqcgBPAAQGwAJP4OoK4hVnSn8cTN7mfJZPK3g0U2/5iI7i92sqP6PQWAy5hgRQUlgIlN9UsAdynWzJ4DHFPZEHswnzKisiGA6bpylBVrXERnT9XbN/tDJpPJTzEzOuj+x2DBzahiq+jrVqbUxAxN81JgAozKnPoa75crE3DBCBCqKAYbKigBRAWjnlut/KJvJppfRAfd/yEiv+KLFy/2eZ63k5n/IugxHokVGAqddxd0+hqAchlP3ysg9T32qlMqU+L9ciymjKugUyCqaAZjqojW17p3P6MAdXXRQu895J/HSgzoMf7ffN8/lVmFoamp6c6gxzhWYahJX2S2QYIHDAZU5nP3KpKVAV0xqq/zKaLKVgfc97gel0Vd5nQZ1GXOkAOr2MubJKJnsebh/Pz8h7pOzYDv+/+GmX9HRLZFqenUUrPgMiI+47KhWs8uCFeyrF1HeaFO8+XYTXVMgFB9kbp3jR11jmenm0VZ1wxChudE5FnP8/6eiM7dXMnL930smgSGvDdKfSLz+VmqIzzbUFFgqojOZkI9djYAiwVkLv0wm0VdMa66J4Cp1ri6hPK57wh8ZlJE3sVKXp7nPZtZyQtrHY6NjXVZa78kIo8R0e6otXZ2gaMiTnVDZT61lPFeX6urp1TAlePBu0yn4USAE2DMtSmjKoAj6rOEQ/wgMz9vjHll06ZNVzKrwY6Pj7ekUqm7mfkbRPSdwA1Ujnmu+jEALtdtgwiM+hMVgCq+lbFKEcflusFsQLo6puqa6jpCNCfbhxlR0Y2EiqdF5OfxePx4d3f39Uz7FLDkyMgI2qlgvew/YubfKtdEV/I4rhPZZUT1Hbp7MKM+ZHdfyesrx7Gz9U/olxrvdn2ZLmNmW+bluI5KHENE3mDmv4WV3dvbm2TmlAKSz5w507Bu3bovB9b2N6PS60dFNACnyRKaVuZay5VOmKjEA3N1Tvf6XfcQxDkYUzc37FipayrTcdGk9AWs4HXt2rUDO3bsWGRmuaXB1MjIyANEhNg2FnHHEsWhyyB3IyoqepUJAUQV0Zog4bJomSZy1Q/j6ouamAG2RHKGsqfr5wyhfolOZ9PMjMXbf9zb23v0ph3gzu7g4OCOWCz2eyICi/sTRBS6hF3Xqa15jW4KWXZYr9YBme3LVGCCMcGeIa1KnCWiD5j5mXQ6/U/9/f3IFr+hUrmAHB0d3ez7/qPM/C0RwRqIPatOB3qhzBlHsrpwwIqaMqYiWjuCFeqWCcs9Fnsdbl6linA3lS2E2UOXmPkQMnw8z9u3efNm5EN+HJDJZLLFGHOXiHxdRL4fprUPFWRgRTCiFmtpbFkfSi0y4kpAzb53TeJwi8NC1gQf2T1PMvOL1toTfX19KGH4OCBFxBscHNzsed4jzPzvAp/kSvNR0f/nEtFapAUwunXWFb2QiBzcNX6ySyFCJMIPishPfN8/1N/fP8rMNzOiP9Y19+TJkw3t7e2fNcb8KRE9TkRtq/ksAEiADiIaBf8AI6xp1RVv/rI4kg2Ayz61rj9Sw5KqV6JGR9PdVtFvieb2z1hr/2p6evqdXbt2LbqTkPMpjo6Obk+n04htfzcob6h6Q3w34qLlqwCkgnGt6YnFIhfAcxsNoIJRe0muQuIGGtujudmTnuf93ebNm7EK7C0jJyAHBwe7jDEwbsCQD1czlKiTpBEXtxUKWNLNsqmDcnmYZrOlFo/pSl8AqoYpq8SYQ8x8xFr7rIi8nEgk0Cw3L0A2M/Odnuc9KiIobahaJjnEjEZdwIbo8ahiWievWLZYy9/TuQModYElbclSRaZ8h5n/r+/7+4wxH7rGTE6jRv+I+PbExERrKpV6kIj+AxEhclPRrhbZzKhNRwFGZca1aEGX60fkGjsAJUQ3uqi5fYIqDEzoiuiS8teNjY2vdXV1XWNmOMhXZkj9BMobiAi1Nt8TkS2VzJNUZgQ7anMo1RlxPXXxXB5oKjABSgDSbV6lz6A8Z/r/RwnyHoehOxLR/+rr6/v1UudY1jRNJpMbAyf574rI55kZrZ8rMlRnhJhG51uAsc6M5Z9q14muTJmtU5b7rCIywsxvIlQIZ3hfX99EsYBsYeZdIvIVsCQRfbbcF+v6GbXBKACJ13WdsdyzfQtrZaSO9pxUpqxQqBE9SOEI/4WInMylOy6rQ7q65Pnz59saGho+B9ENtix3fFv1luUai1busazdIytTqksIgFSdssy65CxYEaJ6cXHxrW3bts3k0h3zAqR+CH5Ja+0PReQHRHRnOQwcZUZMTK5+4HWdsTo/Fsw/WFGXGAEotY0LrqBEdxAMmQ/RBMAY84+5/I4FGTX64bGxsXXW2kestUhLQ4nD7aVOly5jATDCkoaYhmWdnUhb6nnq319+BpQp3TCjRnQ0SlbCHMIJftAY8y/GmEObNm26ttKx8oq3iUhsbGxsazqdfpiZ4ZcEKEtyA+nNKhhhxLi1znWGXOnRlef/rjtIV3jAciNwC6njvMgzgR0Rs95rrT2cSCTOM/ONtP1lRl6AxPfPnTvXFI/HP8nMP0RIEWtsF+MGUv0EE6GObzi/1YjBuepgXOmxlff/rliG5Q2rG6IbBo9bRFbAWQE8tGh+2lr7DyLyQX9//1w+388bkDhYEFL8ahDjRk+ggvMlFZCaLAFmhKh2M7zzufD6Z8o7AwpKAFC79iooizByLhHRERF50lr7cn9/PxZ4zWsUBEhEcMbGxgastSgGg+h+qNAyB/U3QlRjPULsVW+ss2Nez6wiH3JZUtfDgegGKAsU3Yi+HGHmvel0+qVEIvHRclZ19s0UBEh8GTmTIyMj94jIv2ZmJPEmiGjFfkCuqAY76gKZuth6XUxXBGcFH1SNHIhuABLiG6Jbw7YrWN0Q1Vg7ExGZ/9Pb2/uem+uYz8UUDMhAn+xobGxEx104yxHvRtP8JYd7MyqqNWkiKmvG5DOZtfAZAA7hWzVwNLyoCzWtUDB2noheAyAXFhYODAwMTBU6J0UBEiw5NDQ0YIxBatp3mBlW95IFYQpIXRTTFdWulVfoxdc/X/4ZcJ8HRDWsbbW6AdJlAAkH+MHAkIFVfa5QdsyobMXeEqzupqam7SKCThdI5L2DiNblOp6Ka/gcVVTXQ4PFznx1vqfAhLhW0Q2WXMLAQRXhh0T0FDM/PT8/f3ZgYODGYuUFjqIBifPAYY4UtSCkCBGO7CDPvQa9AV1NSxMnamXJ4ALnOzIfdx3mYEnokrC+czQiQD3Mb5j5gLX2uXg8/lo+DvClJqIkQOKg4+Pjvel0+j5r7feZ+euuKwhghBsBolpTytTnuFZLVqOCyOysIOiSblaQsxAAXDwvGWP+2fO8d7q7u0dKuceSASkiPD4+vjmVSn2DmWHkfJ6INmb0gQCQGqtW3XGprmOl3Ej9u+WfAc22Ut+kim6wZPAMkUb2pog8FY/HX+ju7kYFIVqkFD1KBqSeeWho6E5jDMQ2ul7A8m5TVw4sa4ARG3RHBWvRV13/YtVmwAsHYbkAAAcySURBVNUlwZDt7e2ZykUimhERWNSoIDyQSCSgQ5Y8ygZIOM2Hhoa2e56HpqffZeZ7RaQF4hqRmLruWPKzWpUDuLokki4CXfK653nvwojxff9niUTibCHO7+VupGyAxEngDhoeHr4rFotBl3zMWnvf/Px8M6Ix0B11WeB6bcyqYKuok2bnTa5bt26utbX1WFNT03OxWOzF7u5udKEo29JnZQUk7jhoNLAzHo9/O51OPz47O3vX1atXGzVEWM8CLwoXq/olfWaxWGyhqanpRHt7+7MtLS0/m56ePpVd6F/qhZYdkLgg+Cibm5vvSaVSX5+ZmcF29/z8fEsdjKU+rtX7vohcZ+bjTU1NL7a1tb3Y0tLyfrG+xqqJbPdEg4ODzdbandPT09+cnp7+1uLiIlpGo9579Wa1fuZiZ2BORI4T0fOwpj3PO/Xggw/mlU5W6Akrig6A8vLly3dNT09/OZVKfdUY8xlmrvl1cAp9CCH/PNaReQ9pZFixtbm5+USlwJjxvlR6MqBTTkxMoFfQ1xDRYWZULnZU49yVvrcaPz78iUiOQMUgVkl4aXR09OwTTzxxS3Oocs9BxQEZWN/m5ZdfhqGDEgj0DPqciKDJfn2EdAaYOSkib4nIPmY+/Morr5z60Y9+9LFOE+W+/KoAEhf99ttvxycnJ3tjsRic51gPB6W1aDywYi5luW+6frxlZwA5jQj/vUVEz6XT6QOdnZ0j999/f6oa81Y1QOrN7N+/fzszowvGb4Mp0e5PRFa1B2U1JjoK52DmGSLCYupgxl+KyJt79uz5WMu8St5L1QG5d+9er6urq4OZ7/E8bw/KIETkLmZuR7SnkjdbP3buGUCURURQwA9L+ojv+/tF5P0rV65MPfHEE2Vzeucz/1UHpF7Uvn372j3P+zQzYykSLNR0d5BTWRfh+Ty58n0GIvo0M58QkddF5Kjv+7969NFHp8t3ivyPtGqAxCW+9tprCCv2GmPuZWas+oDMc3TGiOd/C/VPljAD0AuRFIFM71d83z/W0tIyUkm3zkrXuqqA1Is7ePBgj7UWjvOHAr3yE8x8W12Er/T4ivt/IKJRN/0B9EUiejUWix1/+OGHS8plLO5qbv1WKACJnMpDhw61isjWQISDLT/HzFtFpLnusyzHo84cQ5gZUZcLgRWNtWKOMvOFRx55ZLbUXMZyXGUoAOneyP79+7d6nnefiNxHRDB2UKuzDals5bjhtXoMZsZaMOdF5DQRIUPnGET0nj17AM7QjNABElZ4d3f3emNMr+/7AOQXiOgLAKaIIOwYumsOzdPMfSFgRSyUDiDCaHnd87wT1tqR8fHxq9W2oleaq1A/3MOHDwOUu4joHmbeKSJgy9uC5gS3FJOtdKNr8P9w16Bo/yIznxaRU0T0vud5J8OgKy71PEINSOiWr776Kiob4aOEfonkDIQdEQ/fulTZ7RoEX/Yto+3dBRE5xsxwcr8LPTEej09/8YtfRLP5kupeKjm/oQake+MHDx6Ef3IHM9+FNRhFZHvAlr3M3LfWdUzoiCKSDMJ+YMWz1tqTgXg+vXv37hVb4VUSaPkeOzKAxA0hHj41NYXiMWQLbTHG7CQisCbqdwaCasdI3VO+D2qZz4HtJpj5HJgwSBWDeB4WkamOjo6ZasWhy3Av0TUQAsbcxsyfstaiQQFeQ79ECa5uWIS+FgeiKChBzWwiAp/ieWPMr0UES26cjwojZj+cSLMJQBmLxdbPz8+vB2vGYjHolUjWwOLz2CDiN4lISd1+w4JoZl4UkTEkQAQLoH+A1+l0GvriVFNT09V0On01qmDEPEcakNlAOXLkyPrFxcXbjDG3iwj6oKMrG5qqbgiSNyDu20RkPRFhC/O4ysxXg6QH1ECDFbE2IDpFoD3yR9bajxoaGi4+9NBDWGG1JkZNARJPZO/evQ1tbW3rmpubW6212Lqw4JMxJuMuwopk0D8DQ2hTCC11WMFjgYEyzMxYAWvIWnsRCxAZY64YY2bn5uZmZ2ZmrlU6g7vaKK85QOaawIMHD3b4vt/neR6y1MGY2DYH4ryTmRG2RCSoiYiwFDP2TcyceR2I/FKzkNIQuUQ0LyJo34HuYNgyrwMrGeE7OLEhlkcDNrzk+37S87zk7t27C+63WG1AlXq+NQFIZc7Ozs7mWCzWbIxBfBxAQ/vADhHZALFORIgEwefZHhSjwSiCRQ8dVQGL7yEbCQBdKisJWTQAIPYZ4KGMlIggWgGqaRGZZGaIYWwopLrMzBDJU8wMP+K8tXYunU7PTU5OztUaEy4F3DUDSEwAjKC5uTnP932vs7PTS6VSjb7vt8VisQ3W2m5m7goACJBmXgOYgd7ZijJeEQFrwkgCGBWYmliMmhP4+wBEbIvMvCAic8yMhp7QBQE+gA6N4AHOKRGBGB5Pp9OXPc+bicfjC5OTk77neX5zc7MfZSOlUMZcU4AsdHLqn6/+DPw/fN4SFK3CY98AAAAASUVORK5CYII=" v-else></image>
					    <image v-if="isAssistNode(user)" class="user_verify" src="../../static/mine/verify_assist_node.png"></image>
					    <image v-if="isCoreNode(user)" class="user_verify" src="../../static/mine/verify_core_node.png"></image>
					    <image v-if="isSuperCodeNode(user)" class="user_verify" src="../../static/mine/verify_super_core_node.png"></image>
					</view>
					<text class="username">{{ user.nickName }}</text>
				</view>
				<view class="user-rigth" :style="{color:user._certificationInfo[1]}">
					{{ user._certificationInfo[0] }}
				</view>
            </view>
        </view>
		
		<uni-load-more   :loading-type="loadingType2" v-if="list.length>0"></uni-load-more>
		
		<status-page v-if="list.length==0" :status="status" @retry="retry" :fixed="false" :custom-empty-text="customEmptyText"></status-page>
		
    </view>
</template>

<script>

    import loadMoreMixins from '@/js/mixins/loadMoreMixins';
    import UniLoadMore from "../../components/uni-load-more";
    import StatusPage from "../../components/StatusPage";
    import NavigationBar from "../../components/NavigationBar";

    export default {
        name: "FansList",

        components: {NavigationBar, StatusPage, UniLoadMore},

        data () {
            return {
                title: '成员列表',
                defaultImage: '',
                list: [],
				searchKey:'',//搜索内容
				currentSearchKey:'',
				status:'',
				loadingType2:0,//1开启，0停止，没有更多数据
				customEmptyText:'',
				currentIsAssistNode:false,//当前登录用户是否是辅助节点
            }
        },

        mixins: [loadMoreMixins],

        computed: {
			
        },

        onLoad (option) {
            const type = option.type;
			this.currentIsAssistNode=option.currentIsAssistNode||false
			console.info(option)
            if (type === 'invite') {
                uni.setNavigationBarTitle({
                    title: '邀请人列表'
                });
            }
        },

        mounted () {
            this.moreLoading = true;
            this.initTap();
        },

        methods: {
			//点击确认
			search(){
				uni.startPullDownRefresh();
				uni.pageScrollTo({ scrollTop: 0, duration: 300 });
				//初始化
				this.reset();
				this.initTap();
			},
			initTap(){
				this.$api.getFans(this.currentPage,this.searchKey).then(result => {
				    if (this.currentPage == 0) {
				        this.list = [];
				    }
					  
				    result.list.forEach(item => {
				        if (!item.nickName) {
				            item.nickName = `用户_${item.userId.substring(0, 6)}`
				        }
				        item._certificationInfo = this.certificationInfo(item)
						console.info(item._certificationInfo)
				    })
					
					this.currentSearchKey = this.searchKey;
				    this.list = [...this.list,...result.list];
					this.loadMoreSuccessHandle(result.list);
					// 缺审页
					if(this.list.length>0){
						this.status='';
						
					}else if(this.searchKey&&this.list.length==0){
						this.customEmptyText='用户不存在';
						this.status='noSearchResult';
						
					}else if(this.list.length==0){
						this.customEmptyText='';
						this.status='empty';
					}
					//上拉加载
					 if(result.list.length==0&&this.currentPage !== 1){
						//关闭上拉加载 且提示没有更多数据
						this.loadingType2=2;
					}else{
						//关闭上拉加载
						this.loadingType2=0;
					}
					console.info(this.loadingType2)
					
				}).catch(error => {
					this.status='network';
				    this.loadMoreErrorHandle(error)
				})
			},
            fetch () {
				//开启上拉加载 
				this.loadingType2=1;
				this.initTap()
            },
			isAuthentication (user) {return user.nodeType == 0 && user.isCheck==0},
            isNormalUser (user) { return user.nodeType == 0 && user.isCheck==1},
            isBuildMine (user) { return user.isBuildMine == 2 && this.currentIsAssistNode },
			isAssistNode (user) { return user.nodeType == 1 },
            isCoreNode (user) { return user.nodeType == 2 },
            isSuperCodeNode (user) { return user.nodeType == 3 },
            certificationInfo (user) {
				if (this.isSuperCodeNode(user)) return ['超级节点','#222222'];
				if (this.isCoreNode(user)) return ['核心节点','#222222'];
				if (this.isBuildMine(user)) return ['已建矿','#222222'];
				if (this.isAssistNode(user)) return ['辅助节点','#222222'];
				if (this.isNormalUser(user)) return ['已认证','#D7AB6C'];
				if (this.isAuthentication(user)) return ['未认证','#999999'];
                return '';
            },
            getDefaultName (user) {
                return `用户_${user.userId.substring(0, 6)}`
            }

        },

    }
</script>

<style scoped lang="less">
	.page{
		
	}
	.search {
	    position: relative;
	    margin: 32upx 30upx;
	
	    .search-icon {
	        width: 28upx;
	        height: 28upx;
	        position: absolute;
	        left: 33upx;
	        top: 50%;
	        transform: translateY(-50%);
	    }
	    input {
	        background-color: #F5F5F5;
	        font-size:26upx;
	        color:rgba(153,153,153,1);
	        border-radius: 120upx;
	        padding-left: 76upx;
	        height: 56upx;
	        line-height: 56upx;
	        color: #222;
	    }
	}
	
    .user-list {
        padding: 0 32upx;
    }
    .user {
        display: flex;
		flex-direction: row;
        align-items: center;
        justify-content: space-between;
		padding: 20upx 0;
        border-bottom: 1upx solid #F2F2F2;
		.user-left{
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		.user-rigth{
			font-size:24upx;
			color: #222222;
		}
        .avatar-container {
            position: relative;
            margin-right: 22upx;
            width:82upx;
            height:82upx;

            .avatar {
                width:82upx;
                height:82upx;
                border-radius:50%;
            }
            .user_verify {
                position: absolute;
                width:36upx;
                height:36upx;
                bottom: -3upx;
                right: -10upx;
            }
        }

        .username {
            font-size:30upx;
            color: #1E1E1E;
            flex: 1;
        }
        
    }


</style>