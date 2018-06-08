<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>{{particular_day_title}}</title>
    <!-- Latest compiled and minified JavaScript -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <style>

        .hoverable {
            height: 20px;
            width: 250px;
            overflow: hidden;

        }
        .hoverable:hover {
            position: absolute;
            transform: translateX(-75%) translateY(-50%);
            height: auto;
            width: 45%;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #777;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 0 4px #555;
            box-sizing: border-box;
        }
        .table-responsive {
            min-height: .01%;
            overflow-x: auto;
        }
        table {
            border: none;
            border-collapse: collapse;
            text-align:left;
            padding: 10px;
            margin-bottom: 40px;
            font-size: 0.9em;
        }

        table th {
            text-align: left;
        }

        .first-bold tr td:first-child{
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="sticky-top">

    <div class="container-fluid">

        {% for key in particular_day_content_aggr.keys() %}
            <div class="card mb-3 shadow">
                <div class="card-body border-bottom text-white bg-success">
                    <h4 class="card-title mb-0">
                        <span class="font-weight-light">Aircraft ID: </span>
                        <span>{{ key }}</span>
                    </h4>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        {{ particular_day_content_aggr[key] }}
                    </li>
                    <li class="list-group-item">
                        {{ particular_day_content_list[key] }}
                    </li>
                </ul>
            </div>
        {% endfor %}

    </div>

</div>
</body>
</html>
