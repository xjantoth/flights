<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>{{particular_day_title}}</title>
    <!-- Latest compiled and minified JavaScript -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <style>

        .hoverable {
            height: 20px;
            min-width: 250px;
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
            overflow: hidden;
        }
    </style>
</head>
<body>

<div class="sticky-top">

    {% for key in particular_day_content_aggr.keys() %}
        <div class="card card border-success mt-3">
            <h3 class="card-header bg-success text-white">
                <small>Aircraft ID:</small> {{ key }}
            </h3>
            <div class="card-body">
                {{ particular_day_content_aggr[key] }}
                {{ particular_day_content_list[key] }}
            </div>
        </div>
    {% endfor %}

</div>
</body>
</html>
